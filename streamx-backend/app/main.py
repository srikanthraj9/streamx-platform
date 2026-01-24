from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import Base, engine
from app.api.routes import auth, movies, user, admin
from app.utils.seed import seed_movies


def create_app():
    app = FastAPI(title=settings.APP_NAME)

    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^http:\/\/(localhost|127\.0\.0\.1|10\.74\.5\.28)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)

    # ✅ THIS is why /uploads works
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    app.include_router(auth.router)
    app.include_router(movies.router)
    app.include_router(user.router)
    app.include_router(admin.router)

    @app.on_event("startup")
    def startup():
        seed_movies()

    return app


app = create_app()
