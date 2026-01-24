from pydantic import BaseModel, EmailStr
from typing import Optional, List

# ---------- AUTH ----------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


# ---------- MOVIES ----------
class MovieOut(BaseModel):
    id: int
    title: str
    description: str
    poster_url: str
    banner_url: str
    release_year: int
    duration_seconds: int
    rating: str
    genre: str

    class Config:
        from_attributes = True

class HomeRow(BaseModel):
    title: str
    items: List[MovieOut]

class HomeResponse(BaseModel):
    featured: Optional[MovieOut] = None
    rows: List[HomeRow]


class StreamResponse(BaseModel):
    type: str
    streamUrl: str
    fallbackUrl: str


# ---------- USER ----------
class ProgressRequest(BaseModel):
    movieId: int
    progressSeconds: int
    durationSeconds: int
