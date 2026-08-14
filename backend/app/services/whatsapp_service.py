import os
import httpx
from typing import Dict, Any, Optional
from app.ai.agent import ai_agent
from app.models.mock_db import USERS_DB, STUDENTS_DB

# Multi-Key Priority Pool
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

OPENAI_BACKUP_KEYS = [k.strip() for k in os.getenv("OPENAI_API_KEYS", "").split(",") if k.strip()]

async def transcribe_whatsapp_voicenote(audio_bytes: bytes, filename: str = "voice_note.ogg") -> str:
    """
    Transcribes incoming WhatsApp voice note audio bytes using Groq Whisper API (default).
    If Groq API fails or rate limits, automatically fails over to OpenAI Whisper API keys in priority order.
    """
    if not audio_bytes or len(audio_bytes) < 10:
        return "What is my current attendance?"
        
    # 1. Primary Attempt: Groq Whisper API (whisper-large-v3-turbo)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            files = {"file": (filename, audio_bytes, "audio/ogg")}
            data = {"model": "whisper-large-v3-turbo", "response_format": "json"}
            headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
            
            response = await client.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                files=files,
                data=data,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                text = result.get("text", "").strip()
                if text:
                    return text
    except Exception as e:
        print("Groq Whisper API call failed, switching to OpenAI backup keys:", e)

    # 2. Failover Pool: OpenAI Whisper API keys (whisper-1)
    for idx, open_ai_key in enumerate(OPENAI_BACKUP_KEYS, start=1):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                files = {"file": (filename, audio_bytes, "audio/ogg")}
                data = {"model": "whisper-1", "response_format": "json"}
                headers = {"Authorization": f"Bearer {open_ai_key}"}
                
                response = await client.post(
                    "https://api.openai.com/v1/audio/transcriptions",
                    files=files,
                    data=data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    result = response.json()
                    text = result.get("text", "").strip()
                    if text:
                        print(f"OpenAI Backup Key #{idx} succeeded!")
                        return text
        except Exception as e:
            print(f"OpenAI Backup Key #{idx} failed, trying next key:", e)
        
    return "What is my current attendance?"


async def process_whatsapp_incoming_message(
    from_number: str,
    message_text: Optional[str] = None,
    audio_bytes: Optional[bytes] = None,
    explicit_student_id: Optional[str] = None,
    explicit_role: Optional[str] = None
) -> Dict[str, Any]:
    """
    Processes incoming WhatsApp text messages or voice notes, maps sender phone number to student/parent,
    runs natural language query through CollegeAI engine, and returns formatted WhatsApp response.
    """
    transcribed_from_voice = False
    
    # If audio voice note provided, transcribe using Groq/OpenAI Whisper failover
    if audio_bytes and not message_text:
        message_text = await transcribe_whatsapp_voicenote(audio_bytes)
        transcribed_from_voice = True
    elif not message_text:
        message_text = "What is my current attendance?"

    # Match user profile by phone or fallback to persona
    role = explicit_role or "PARENT"
    student_id = explicit_student_id or "STU001"
    user_name = "Parent"

    # Search USERS_DB values by phone
    for u in USERS_DB.values():
        if isinstance(u, dict) and u.get("phone") and str(u["phone"]) in str(from_number):
            role = u.get("role", "PARENT")
            user_name = u.get("name", "User")
            if role == "STUDENT":
                student_id = u.get("id", u.get("student_id", "STU101"))
            elif role == "PARENT":
                student_id = (u.get("authorized_children") or ["STU101"])[0]
            break

    user_context = {
        "role": role,
        "name": user_name,
        "student_id": student_id,
        "authorized_children": [student_id]
    }

    # Process query using CollegeAI agent
    ai_response = await ai_agent.process_user_message(
        message=message_text,
        user_context=user_context,
        explicit_target_student_id=student_id
    )

    reply_text = ai_response.reply
    
    # Clean WhatsApp header without technical robotic labels
    if transcribed_from_voice:
        final_whatsapp_reply = f"🎙️ *Voice Note Transcribed:* \"{message_text}\"\n\n{reply_text}"
    else:
        final_whatsapp_reply = reply_text

    return {
        "from": from_number,
        "query_text": message_text,
        "is_voice_note": transcribed_from_voice,
        "reply": final_whatsapp_reply,
        "raw_agent_response": ai_response.model_dump()
    }
