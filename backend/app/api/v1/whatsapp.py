from fastapi import APIRouter, Request, Response, Form, UploadFile, File, Query
from typing import Optional
from pydantic import BaseModel
from app.services.whatsapp_service import process_whatsapp_incoming_message, transcribe_whatsapp_voicenote

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp Bot Webhook"])

class WhatsAppSimulateRequest(BaseModel):
    from_number: str = "+919876543210"
    message: Optional[str] = "What is my current attendance?"
    is_voice_note: bool = False
    student_id: Optional[str] = "STU001"
    role: Optional[str] = "PARENT"

@router.get("/webhook")
async def verify_whatsapp_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token")
):
    """
    Meta / Twilio WhatsApp Webhook Verification challenge endpoint.
    """
    if hub_challenge:
        return Response(content=hub_challenge, media_type="text/plain")
    return {"status": "CollegeAI WhatsApp Webhook Active", "challenge": hub_challenge}


@router.post("/webhook")
async def receive_whatsapp_webhook(
    request: Request,
    From: Optional[str] = Form(None),
    Body: Optional[str] = Form(None),
    MediaUrl0: Optional[str] = Form(None)
):
    """
    Twilio / Meta WhatsApp Webhook Receiver for Text Messages & Voice Notes.
    """
    from_number = From or "+919876543210"
    message_text = Body
    audio_bytes = None

    # Handle voice note media download if URL provided
    if MediaUrl0:
        import httpx
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(MediaUrl0)
                if res.status_code == 200:
                    audio_bytes = res.content
        except Exception as e:
            print("WhatsApp Media fetch exception:", e)

    result = await process_whatsapp_incoming_message(
        from_number=from_number,
        message_text=message_text,
        audio_bytes=audio_bytes
    )

    # Return Twilio TwiML XML or JSON
    twiml_reply = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{result['reply']}</Message>
</Response>"""
    return Response(content=twiml_reply, media_type="application/xml")


@router.post("/simulate")
async def simulate_whatsapp_interaction(payload: WhatsAppSimulateRequest):
    """
    Live WhatsApp Bot Simulator endpoint for web app UI testing.
    Supports both text messages and simulated voice note transcription.
    """
    audio_bytes = None
    if payload.is_voice_note:
        # Dummy audio payload trigger for demo voice notes
        audio_bytes = b"MOCK_OGG_AUDIO_BYTES_FOR_WHATSAPP_VOICE_NOTE"

    result = await process_whatsapp_incoming_message(
        from_number=payload.from_number,
        message_text=payload.message if not payload.is_voice_note else None,
        audio_bytes=audio_bytes,
        explicit_student_id=payload.student_id,
        explicit_role=payload.role
    )
    return result
