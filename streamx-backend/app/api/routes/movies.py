from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db
from app.db import models
from app.db.schemas import MovieOut, HomeResponse, StreamResponse

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/home", response_model=HomeResponse)
def get_home(db: Session = Depends(get_db)):
    movies = db.query(models.Movie).all()
    if not movies:
        return {"featured": None, "rows": []}

    featured = movies[0]
    genres = {}

    for m in movies:
        genres.setdefault(m.genre or "General", []).append(m)

    rows = [{"title": g, "items": items[:20]} for g, items in genres.items()]
    return {"featured": featured, "rows": rows}


@router.get("/search", response_model=List[MovieOut])
def search_movies(q: str = "", db: Session = Depends(get_db)):
    if not q:
        return []
    return db.query(models.Movie).filter(
        models.Movie.title.ilike(f"%{q}%")
    ).all()


@router.get("/{movie_id}", response_model=MovieOut)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@router.get("/{movie_id}/stream", response_model=StreamResponse)
def get_stream(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return {
        "type": movie.stream_type or "mp4",
        "streamUrl": movie.stream_url or "",
        "fallbackUrl": movie.fallback_url or "",
    }
