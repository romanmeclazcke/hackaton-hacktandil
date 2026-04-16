import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.core.exceptions.exceptions import CompanyAlreadyExistsError, CompanyNotFoundError
from src.schemas.company import CompanyCreate, CompanyResponse
from src.services.company_service import CompanyService

router = APIRouter(prefix="/companies")


@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)) -> CompanyResponse:
    service = CompanyService(db)
    try:
        company = service.create_company(payload)
    except CompanyAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return CompanyResponse.model_validate(company)


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: uuid.UUID, db: Session = Depends(get_db)) -> CompanyResponse:
    service = CompanyService(db)
    try:
        company = service.get_company(company_id)
    except CompanyNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return CompanyResponse.model_validate(company)
