from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _bcrypt_safe_password(password: str) -> bytes:
    """
    bcrypt accepts max 72 bytes.
    If password exceeds, bcrypt will crash.
    """
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    safe_pw = _bcrypt_safe_password(password)
    return pwd_context.hash(safe_pw)


def verify_password(password: str, hashed: str) -> bool:
    safe_pw = _bcrypt_safe_password(password)
    return pwd_context.verify(safe_pw, hashed)


def create_access_token(data: dict, expires_minutes: int | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
