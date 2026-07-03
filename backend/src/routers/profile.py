from fastapi import APIRouter, Depends, HTTPException, Request

from ..crud import recognize_user, get_user_from_id
from ..database import get_db
from ..middleware import get_user_from_token
from ..models import User
from ..schemas import ProfileRead

from sqlalchemy.orm import Session


profile_router = APIRouter(
    prefix="/api/profile",
    tags=["profile"],
)


@profile_router.get("/", response_model=ProfileRead)
def profile(request:Request, db:Session = Depends(get_db)):
    return recognize_user(db=db,request=request)


@profile_router.get("/partner",response_model=ProfileRead)
def partner(request:Request, db:Session = Depends(get_db)):
    payload = get_user_from_token(request=request)
    if not payload:
        raise HTTPException(status_code=403, detail="Invalid token")

    db_user = db.query(User).filter(User.username == payload.get("username")).scalar()
    if db_user and db_user.id == 1:
        return get_user_from_id(db=db,user_id=2)
    return get_user_from_id(db=db,user_id=1)
