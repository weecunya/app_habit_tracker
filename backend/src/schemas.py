from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class HabitCreate(BaseModel):
    title: str = Field(..., max_length=100,examples=["Write the title"])
    description: str = Field(max_length=500,examples=["Write the description"])
    count: int = Field(...,examples=["Write the goal"])
    created_by: str = Field(...,examples=["Write the username"])


class HabitUpdate(BaseModel):
    id: int
    title: str | None
    description: str | None
    count: int | None
    is_done: bool | None


class HabitRead(BaseModel):
    class Config:
        from_attributes=True

    id: int
    title:str
    description: str
    count: int
    created_at: datetime
    is_done: bool
    # is_done_by_partner: bool
    created_by: str


class HabitListResponse(BaseModel):
    items: list[HabitRead]
    total: int
    limit: int
    offset: int


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str = Field(..., max_length=30)
    password: str = Field(..., max_length=30)


class ProfileRead(BaseModel):
    username: str
    habits: int