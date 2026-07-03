import hashlib
import secrets

import jwt
from  .config import settings


def get_user_from_token(request):
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    try:
        payload = jwt.decode(token, settings.JWT_KEY, algorithms=['HS256'])

    except jwt.InvalidTokenError:
        return None

    return payload


def hash_password(password:str) -> str:
    salt = secrets.token_hex(16)
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode("utf-8"),10000)
    return f"{salt}${hash_obj.hex()}"

def check_password(plain:str,hashed:str) -> bool:
    salt, hash_val = hashed.split('$')
    new_hash = hashlib.pbkdf2_hmac('sha256', plain.encode("utf-8"), salt.encode("utf-8"), 10000)
    return new_hash.hex() == hash_val
