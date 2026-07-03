from typing import Annotated

from fastapi import APIRouter, Request, HTTPException, Response, Depends
from sqlalchemy.orm import Session
from starlette import status

from ..crud import create_user, get_user
from ..database import get_db
from ..middleware import check_password
from ..schemas import *

auth_router = APIRouter(prefix='/api')


@auth_router.post("/register")
def register(request: RegisterRequest,response: Response, db: Session = Depends(get_db)):
    payload = RegisterRequest(
        username=request.username,
        password=request.password
    )
    return create_user(db,payload, response)





@auth_router.post("/login")
def login(request: LoginRequest,response: Response, db:Session = Depends(get_db)):
    payload = LoginRequest(
        username=request.username,
        password=request.password
    )
    return get_user(db,payload, response)


