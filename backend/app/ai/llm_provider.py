import os
import httpx
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.tools.tool_registry import AI_TOOLS_DEFINITIONS

logger = logging.getLogger(__name__)

class LLMProviderService:
    def __init__(self):
        # Default Primary API Key: Groq Key
        self.groq_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        
        # Priority Failover Pool: OpenAI Backup Keys
        openai_env_keys = os.getenv("OPENAI_API_KEYS", "").split(",")
        self.openai_keys = [k.strip() for k in openai_env_keys if k.strip()]

    async def generate_response_with_tools(
        self,
        system_prompt: str,
        user_message: str,
        tools: List[Dict[str, Any]] = AI_TOOLS_DEFINITIONS
    ) -> Dict[str, Any]:
        """
        Attempts live LLM generation with multi-key priority failover.
        Priority 1: Groq API Key (Default)
        Priority 2: OpenAI Key 1
        Priority 3: OpenAI Key 2
        Priority 4: OpenAI Key 3
        Fallback: Local Deterministic Engine (100% reliable)
        """
        # 1. Default Primary Attempt: Groq API
        if self.groq_key:
            try:
                res = await self._call_groq_api(system_prompt, user_message)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Groq Primary API failed, switching to OpenAI failover pool: {e}")

        # 2. Priority Failover Pool: OpenAI Backup Keys
        for idx, key in enumerate(self.openai_keys, start=1):
            try:
                res = await self._call_openai_api(key, system_prompt, user_message)
                if res:
                    logger.info(f"OpenAI Backup Key #{idx} succeeded!")
                    return res
            except Exception as e:
                logger.warning(f"OpenAI Backup Key #{idx} failed, switching to next key: {e}")

        # 3. Deterministic Local Intent Planner (Always active, 100% reliable)
        return {"mode": "LOCAL_DETERMINISTIC"}

    async def _call_groq_api(self, system_prompt: str, user_message: str) -> Optional[Dict[str, Any]]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return {"mode": "LIVE_LLM", "text_response": text}
        return None

    async def _call_openai_api(self, api_key: str, system_prompt: str, user_message: str) -> Optional[Dict[str, Any]]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                return {"mode": "LIVE_LLM", "text_response": text}
        return None

llm_provider = LLMProviderService()
