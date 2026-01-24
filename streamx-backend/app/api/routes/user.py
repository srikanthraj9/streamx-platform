from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.db import models
from app.db.schemas import MovieOut, ProgressRequest
from typing import List
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {"id": user.id, "name": user.name, "email": user.email}

@router.get("/watchlist", response_model=List[MovieOut])
def get_watchlist(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(models.Watchlist).filter(models.Watchlist.user_id == user.id).all()
    movie_ids = [i.movie_id for i in items]
    movies = db.query(models.Movie).filter(models.Movie.id.in_(movie_ids)).all() if movie_ids else []
    return movies

@router.post("/watchlist/{movie_id}")
def add_watchlist(movie_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    exists = db.query(models.Watchlist).filter(
        models.Watchlist.user_id == user.id,
        models.Watchlist.movie_id == movie_id
    ).first()

    if exists:
        return {"message": "Already in watchlist"}

    item = models.Watchlist(user_id=user.id, movie_id=movie_id)
    db.add(item)
    db.commit()
    return {"message": "Added to watchlist"}

@router.delete("/watchlist/{movie_id}")
def remove_watchlist(movie_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = db.query(models.Watchlist).filter(
        models.Watchlist.user_id == user.id,
        models.Watchlist.movie_id == movie_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Not in watchlist")

    db.delete(item)
    db.commit()
    return {"message": "Removed from watchlist"}

@router.post("/history/progress")
def update_progress(payload: ProgressRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    record = db.query(models.WatchHistory).filter(
        models.WatchHistory.user_id == user.id,
        models.WatchHistory.movie_id == payload.movieId
    ).first()

    completed = payload.durationSeconds > 0 and payload.progressSeconds >= payload.durationSeconds - 10

    if not record:
        record = models.WatchHistory(
            user_id=user.id,
            movie_id=payload.movieId,
            progress_seconds=payload.progressSeconds,
            duration_seconds=payload.durationSeconds,
            completed=completed,
            last_watched_at=datetime.utcnow(),
        )
        db.add(record)
    else:
        record.progress_seconds = payload.progressSeconds
        record.duration_seconds = payload.durationSeconds
        record.completed = completed
        record.last_watched_at = datetime.utcnow()

    db.commit()
    return {"message": "Progress updated"}

@router.get("/history")
def get_history(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(models.WatchHistory).filter(models.WatchHistory.user_id == user.id).all()
    return [
        {
            "movieId": i.movie_id,
            "progressSeconds": i.progress_seconds,
            "durationSeconds": i.duration_seconds,
            "completed": i.completed,
            "lastWatchedAt": i.last_watched_at.isoformat()
        }
        for i in items
    ]
