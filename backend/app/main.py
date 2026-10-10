from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.core.config import settings
from backend.app.db.database import engine, Base, SessionLocal
from backend.app.db.seed import seed_database_if_empty

# Routers
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.students import router as students_router
from backend.app.api.v1.analytics import router as analytics_router
from backend.app.api.v1.courses import router as courses_router
from backend.app.api.v1.learning_twin import router as learning_twin_router
from backend.app.api.v1.quizzes import router as quizzes_router
from backend.app.api.v1.planner import router as planner_router
from backend.app.api.v1.recommendations import router as recommendations_router
from backend.app.api.v1.faculty import router as faculty_router
from backend.app.api.v1.admin import router as admin_router
from backend.app.api.v1.copilot import router as copilot_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize all database tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed database idempotently
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
        
    print(f"🚀 {settings.PROJECT_NAME} initialized successfully with all 14 entities!")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="CampusIQ AI Student Success & Retention Early Warning Platform API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Explicit CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
api_v1 = settings.API_V1_STR
app.include_router(health_router, prefix=api_v1, tags=["Health"])
app.include_router(auth_router, prefix=f"{api_v1}/auth", tags=["Authentication"])
app.include_router(students_router, prefix=f"{api_v1}/students", tags=["Students"])
app.include_router(analytics_router, prefix=f"{api_v1}/analytics", tags=["Analytics"])
app.include_router(courses_router, prefix=f"{api_v1}/courses", tags=["Courses"])
app.include_router(learning_twin_router, prefix=f"{api_v1}/learning-twin", tags=["Digital Learning Twin"])
app.include_router(quizzes_router, prefix=f"{api_v1}/quizzes", tags=["Adaptive Quizzes"])
app.include_router(planner_router, prefix=f"{api_v1}/planner", tags=["Study Planner"])
app.include_router(recommendations_router, prefix=f"{api_v1}/recommendations", tags=["Recommendations"])
app.include_router(faculty_router, prefix=f"{api_v1}/faculty", tags=["Faculty"])
app.include_router(admin_router, prefix=f"{api_v1}/admin", tags=["Admin"])
app.include_router(copilot_router, prefix=f"{api_v1}/ai", tags=["AI Copilot"])

# Root redirect / status
@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "team": "DEBUG MASTERS · HacXLerate 2026",
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
