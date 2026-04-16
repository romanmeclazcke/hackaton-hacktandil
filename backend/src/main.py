from fastapi import FastAPI

from src.app.api.routes import api_router
from src.core.config import settings


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.app_debug,
        version="0.1.0",
    )
    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_application()
