from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlist = relationship("Watchlist", back_populates="user")
    history = relationship("WatchHistory", back_populates="user")


class Movie(Base):
    __tablename__ = "movies"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    poster_url = Column(String(500), default="")
    banner_url = Column(String(500), default="")
    release_year = Column(Integer, default=2024)
    duration_seconds = Column(Integer, default=0)
    rating = Column(String(20), default="PG-13")
    genre = Column(String(100), default="General")

    # Stream (HLS / mp4)
    stream_type = Column(String(50), default="mp4")
    stream_url = Column(String(500), default="")
    fallback_url = Column(String(500), default="")

class Watchlist(Base):
    __tablename__ = "watchlist"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlist")

class WatchHistory(Base):
    __tablename__ = "watch_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    movie_id = Column(Integer, ForeignKey("movies.id"))
    progress_seconds = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    last_watched_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history")
