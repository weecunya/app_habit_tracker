from typing import List

import jwt
from fastapi import HTTPException

from .config import settings
from .middleware import hash_password, check_password, get_user_from_token
from .models import User, Habit
from .schemas import *

from sqlalchemy.orm import Session
from fastapi import Request, Response


def create_user(
        db: Session,
        payload: RegisterRequest,
        response: Response
) -> ProfileRead:
    token = jwt.encode({
        "username": payload.username,
        "password": hash_password(payload.password),
    },
        settings.JWT_KEY, algorithm="HS256")
    if db.query(User).count() >= 2:
        raise HTTPException(status_code=400, detail="Only one partner can be added")
    db_user = User(
        username=payload.username,
        password=hash_password(payload.password),
        jwt_token=str(token)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    response.set_cookie(key="access-token", value=token, httponly=True, secure=False)

    return ProfileRead(
        username=db_user.username,
        habits=db_user.habits
    )

def get_user(
        db: Session,
        request: LoginRequest,
        response: Response
) -> ProfileRead:
        db_user = db.query(User).filter(User.username == request.username).scalar()
        if not db_user:
            raise HTTPException(status_code=403, detail="User not found")
        if not check_password(plain=request.password, hashed=db_user.password):
            raise HTTPException(status_code=403, detail="Invalid password")
        response.set_cookie(key="access-token", value=db_user.jwt_token, httponly=True, secure=False)
        return ProfileRead(
            username=db_user.username,
            habits=db_user.habits
        )


def recognize_user(
        db: Session,
        request: Request
):
    payload = get_user_from_token(request)
    if not payload:
        raise HTTPException(status_code=403, detail="Invalid token")
    db_user = db.query(User).filter(User.username == payload.get('username')).scalar()
    if not db_user:
       raise HTTPException(status_code=403, detail="Invalid token")
    return ProfileRead(
        username=db_user.username,
        habits=db_user.habits
    )

def get_user_from_id(db: Session,
        user_id: int,
) -> ProfileRead:
        db_user = db.query(User).filter(User.id == user_id).scalar()
        if not db_user:
            raise HTTPException(status_code=403, detail="User not found")
        return ProfileRead(
            username=db_user.username,
            habits=db_user.habits
        )


def create_habit(
        db: Session,
        payload: HabitCreate,
        request: Request
) -> HabitRead:
    body= get_user_from_token(request)
    if not body:
        raise HTTPException(status_code=403, detail="Invalid token")
    db_user = db.query(User).filter(User.username == body.get('username')).scalar()
    db_user.habits += 1
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db_habit = Habit(
        title=payload.title,
        description=payload.description,
        count=payload.count,
        created_by=payload.created_by
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return HabitRead(
        id=db_habit.id,
        title=db_habit.title,
        description=db_habit.description,
        count=db_habit.count,
        is_done=db_habit.is_done,
        created_by=db_habit.created_by,
        created_at=db_habit.created_at,
        # is_done_by_partner=db_habit.is_done_by_partner
    )


def get_habit(
        db: Session,
        habit_id: int
) -> HabitRead:
    db_habit = db.query(Habit).filter(Habit.id == habit_id).scalar()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return HabitRead(
        id=db_habit.id,
        title=db_habit.title,
        description=db_habit.description,
        count=db_habit.count,
        is_done=db_habit.is_done,
        created_by=db_habit.created_by,
        created_at=db_habit.created_at,
        # is_done_by_partner=db_habit.is_done_by_partner
    )

def get_habit_list(
        db: Session,
) :
    db_habits = db.query(Habit).all()
    if not db_habits:
        raise HTTPException(status_code=404, detail="Habit's list is empty")
    print(db_habits)
    return list(HabitRead.model_validate(db_habit, from_attributes=True) for db_habit in db_habits)
    # return db_habits

def update_habit(
        db: Session,
        payload: HabitUpdate
) -> HabitRead:
    db_habit = db.query(Habit).filter(Habit.id == payload.id).scalar()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    if payload.title:
        db_habit.title = payload.title
    if payload.description:
        db_habit.description = payload.description
    if payload.count:
        db_habit.count = payload.count
    if payload.is_done:
        db_habit.is_done = payload.is_done
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return HabitRead(
        id=db_habit.id,
        title=db_habit.title,
        description=db_habit.description,
        count=db_habit.count,
        is_done=db_habit.is_done,
        created_by=db_habit.created_by,
        created_at=db_habit.created_at,
        # is_done_by_partner=db_habit.is_done_by_partner
    )


def delete_habit(
        db: Session,
        habit_id: int
) -> HabitRead:
    db_habit = db.query(Habit).filter(Habit.id == habit_id).scalar()
    if db_habit:
        habit_to_delete = HabitRead(
            id=db_habit.id,
            title=db_habit.title,
            description=db_habit.description,
            count=db_habit.count,
            is_done=db_habit.is_done,
            created_by=db_habit.created_by,
            created_at=db_habit.created_at,
            # is_done_by_partner=db_habit.is_done_by_partner
        )
        db.delete(db_habit)
        db.commit()
        return habit_to_delete
    raise HTTPException(status_code=404, detail="Habit not found")

