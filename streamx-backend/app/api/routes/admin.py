import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user  # ✅ Correct import
from app.db.database import SessionLocal
from app.db import models

router = APIRouter(prefix="/admin", tags=["Admin"])

# ✅ Upload directories
UPLOAD_DIR = "uploads"
POSTERS_DIR = os.path.join(UPLOAD_DIR, "posters")
BANNERS_DIR = os.path.join(UPLOAD_DIR, "banners")
VIDEOS_DIR = os.path.join(UPLOAD_DIR, "videos")

# ✅ Ensure folders exist
os.makedirs(POSTERS_DIR, exist_ok=True)
os.makedirs(BANNERS_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)

# ✅ Your admin email
ADMIN_EMAIL = "srikanthrajuppalapati999@gmail.com"


# ✅ DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Admin restriction
def require_admin(user=Depends(get_current_user)):
    if user.email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ✅ Save file to disk
def save_upload(file: UploadFile, folder: str):
    ext = os.path.splitext(file.filename)[1].lower()
    unique_name = f"{uuid4().hex}{ext}"
    file_path = os.path.join(folder, unique_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ return nice unix path
    return file_path.replace("\\", "/")


# ==========================
# ✅ Upload Endpoints
# ==========================

@router.post("/upload/poster")
async def upload_poster(
    file: UploadFile = File(...),
    _admin=Depends(require_admin),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Poster must be an image")

    path = save_upload(file, POSTERS_DIR)
    return {"url": f"/{path}"}


@router.post("/upload/banner")
async def upload_banner(
    file: UploadFile = File(...),
    _admin=Depends(require_admin),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Banner must be an image")

    path = save_upload(file, BANNERS_DIR)
    return {"url": f"/{path}"}


@router.post("/upload/video")
async def upload_video(
    file: UploadFile = File(...),
    _admin=Depends(require_admin),
):
    # ✅ Accept most common formats
    allowed_types = [
        "video/mp4",
        "video/x-matroska",        # mkv
        "video/mpeg",
        "video/quicktime",         # mov
        "application/octet-stream" # some browsers send this
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid video type: {file.content_type}"
        )

    path = save_upload(file, VIDEOS_DIR)
    return {"url": f"/{path}"}


# ==========================
# ✅ Create Movie Endpoint
# ==========================

@router.post("/movies")
def create_movie(
    payload: dict,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """
    payload example:
    {
      "title": "...",
      "description": "...",
      "genre": "...",
      "release_year": 2023,
      "duration_seconds": 10500,
      "rating": "PG-13",
      "poster_url": "/uploads/posters/xxx.jpg",
      "banner_url": "/uploads/banners/xxx.jpg",
      "stream_url": "/uploads/videos/xxx.mkv"
    }
    """

    movie = models.Movie(
        title=payload.get("title"),
        description=payload.get("description"),
        poster_url=payload.get("poster_url"),
        banner_url=payload.get("banner_url"),
        release_year=payload.get("release_year"),
        duration_seconds=payload.get("duration_seconds"),
        rating=payload.get("rating", "PG-13"),
        genre=payload.get("genre", "Action"),
        stream_type="mp4",
        stream_url=payload.get("stream_url"),
        fallback_url=payload.get("stream_url"),
    )

    db.add(movie)
    db.commit()
    db.refresh(movie)

    return {"message": "Movie created ✅", "movie_id": movie.id}
