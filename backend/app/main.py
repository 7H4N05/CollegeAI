import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database.connection import engine, Base
from backend.app.routers import auth, students, calculations, announcements

load_dotenv()

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CollegeAI API Backend",
    description="Backend APIs for CollegeAI personalized companion (Database, Auth, Identity, Deterministic Calculations)",
    version="1.0.0"
)

# Enable CORS for frontend web client & local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(calculations.router)
app.include_router(announcements.router)

@app.get("/")
def root():
    return {
        "app": "CollegeAI Backend",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
