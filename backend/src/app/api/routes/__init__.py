from fastapi import APIRouter
from src.app.api.routes.companies import router as companies_router
from src.app.api.routes.users import router as users_router

api_router = APIRouter()
api_router.include_router(companies_router, tags=["companies"])
api_router.include_router(users_router, tags=["users"])
