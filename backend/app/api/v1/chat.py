from fastapi import APIRouter, Depends
from app.core.security import get_current_user_from_header
from app.schemas.domain import ChatRequest, ChatResponse
from app.ai.agent import ai_agent

router = APIRouter(prefix="/chat", tags=["AI Conversational Agent"])

@router.post("", response_model=ChatResponse)
async def chat_with_college_ai(
    payload: ChatRequest,
    user: dict = Depends(get_current_user_from_header)
):
    """
    Conversational AI endpoint processing natural language queries from students or parents.
    Calls secure deterministic backend tools, validates permissions, and generates structured responses.
    """
    return await ai_agent.process_user_message(
        message=payload.message,
        user_context=user,
        explicit_target_student_id=payload.student_id
    )
