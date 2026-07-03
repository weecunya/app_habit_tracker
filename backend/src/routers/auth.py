from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..crud import create_user, get_user
from ..database import get_db
from ..schemas import *

auth_router = APIRouter(prefix='/api')


@auth_router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    payload = RegisterRequest(
        username=request.username,
        password=request.password
    )
    return create_user(db,payload)





@auth_router.post("/login")
def login(request: LoginRequest, db:Session = Depends(get_db)):
    payload = LoginRequest(
        username=request.username,
        password=request.password
    )
    return get_user(db,payload)


