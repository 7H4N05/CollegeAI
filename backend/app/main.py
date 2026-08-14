from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, students, parents, calculations, announcements, chat, whatsapp

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Personalized AI College Companion API for Students and Parents.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Frontend integration (React/Vite) and local demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix="/api/v1/student")
app.include_router(parents.router, prefix=settings.API_V1_STR)
app.include_router(calculations.router, prefix=settings.API_V1_STR)
app.include_router(announcements.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(whatsapp.router, prefix=settings.API_V1_STR)

@app.get("/")
@app.get("/api")
def root():
    return {
        "project": "CollegeAI",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "whatsapp_webhook": f"{settings.API_V1_STR}/whatsapp/webhook"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
