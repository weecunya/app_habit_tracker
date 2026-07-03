from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.auth import  auth_router

from .models import Base

from sqlalchemy import create_engine

from .routers.habits import habits_router
from .routers.profile import profile_router

DATABASE_URL = 'sqlite:///./habits.db'
engine = create_engine(DATABASE_URL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    prefix=["/api"],
    docs_url="/docs",
    lifespan=lifespan

)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://habit-tracker-git-main-weecunyas-projects.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],

)

app.include_router(auth_router, tags=["auth"])
app.include_router(habits_router, tags=["habits"])
app.include_router(profile_router, tags=["profile"])


@app.get("/health")
def health():
    return {'status': 'ok'}