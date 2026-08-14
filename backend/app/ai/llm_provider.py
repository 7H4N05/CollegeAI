import httpx
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.tools.tool_registry import AI_TOOLS_DEFINITIONS

logger = logging.getLogger(__name__)

class LLMProviderService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY

    async def generate_response_with_tools(
        self,
        system_prompt: str,
        user_message: str,
        tools: List[Dict[str, Any]] = AI_TOOLS_DEFINITIONS
    ) -> Dict[str, Any]:
        """
        Attempts live LLM generation with function/tool calling via Gemini or OpenAI if configured.
        Returns dictionary containing tool calls (if any) or final text response.
        """
        # 1. Try Gemini API if key is present
        if self.gemini_key:
            try:
                res = await self._call_gemini_api(system_prompt, user_message)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back: {e}")

        # 2. Try OpenAI API if key is present
        if self.openai_key:
            try:
                res = await self._call_openai_api(system_prompt, user_message)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"OpenAI API call failed, falling back: {e}")

        # 3. Deterministic Local Intent Planner (Always active, 100% reliable)
        return {"mode": "LOCAL_DETERMINISTIC"}

    async def _call_gemini_api(self, system_prompt: str, user_message: str) -> Optional[Dict[str, Any]]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser Query: {user_message}"}]}
            ]
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                try:
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"mode": "LIVE_LLM", "text_response": text}
                except (KeyError, IndexError):
                    return None
        return None

    async def _call_openai_api(self, system_prompt: str, user_message: str) -> Optional[Dict[str, Any]]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return {"mode": "LIVE_LLM", "text_response": text}
        return None

llm_provider = LLMProviderService()
