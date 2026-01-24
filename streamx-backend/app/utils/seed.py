from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db import models

def seed_movies():
    db: Session = SessionLocal()
    try:
        existing = db.query(models.Movie).count()
        if existing > 0:
            return

        demo = [
            models.Movie(
                title="The Last Horizon",
                description="A sci-fi survival story beyond the stars.",
                poster_url="https://picsum.photos/300/450?random=1",
                banner_url="https://picsum.photos/1200/600?random=1",
                release_year=2024,
                duration_seconds=7200,
                rating="PG-13",
                genre="Sci-Fi",
                stream_type="mp4",
                stream_url="",
                fallback_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            ),
            models.Movie(
                title="Shadow Protocol",
                description="A spy thriller with unexpected betrayal.",
                poster_url="https://picsum.photos/300/450?random=2",
                banner_url="https://picsum.photos/1200/600?random=2",
                release_year=2023,
                duration_seconds=6900,
                rating="R",
                genre="Action",
                stream_type="mp4",
                stream_url="",
                fallback_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            ),
        ]

        db.add_all(demo)
        db.commit()
    finally:
        db.close()
