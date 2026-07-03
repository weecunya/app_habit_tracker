from typing import List
from urllib import request

from fastapi import APIRouter, Request, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from ..crud import create_habit, get_habit, get_habit_list, update_habit, delete_habit
from ..database import get_db
from ..schemas import HabitCreate, HabitRead, HabitUpdate

habits_router = APIRouter(
    prefix="/api/habits",
    tags=["habits"]
)


@habits_router.post("/create", response_model=HabitRead)
def create(body: HabitCreate,request: Request, db: Session = Depends(get_db)):
    return create_habit(db=db, payload=body, request=request)


@habits_router.get("/", response_model=List[HabitRead])
def read_habit(db:Session = Depends(get_db)):
    return get_habit_list(db=db)


@habits_router.patch("/update", response_model=HabitRead)
def update(request: HabitUpdate,db: Session = Depends(get_db)):
    return update_habit(db=db, payload=request)


@habits_router.delete("/delete", response_model=HabitRead)
def delete(request: Request,habit_id: int, db: Session = Depends(get_db)):
    return delete_habit(db=db,habit_id=habit_id)