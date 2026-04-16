import uuid

from sqlalchemy.orm import Session

from src.core.exceptions.exceptions import CompanyAlreadyExistsError, CompanyNotFoundError
from src.models.company import Company
from src.repositories.company_repository import CompanyRepository
from src.repositories.user_repository import UserRepository
from src.schemas.company import CompanyCreate
from src.services.password_service import PasswordService


class CompanyService:
    def __init__(self, db: Session) -> None:
        self.company_repository = CompanyRepository(db)
        self.user_repository = UserRepository(db)
        self.password_service = PasswordService()

    def create_company(self, payload: CompanyCreate) -> Company:
        existing_company_by_name = self.company_repository.get_by_name(payload.name)
        if existing_company_by_name is not None:
            raise CompanyAlreadyExistsError("Company name already registered")

        existing_company_by_email = self.company_repository.get_by_email(str(payload.email))
        if existing_company_by_email is not None:
            raise CompanyAlreadyExistsError("Company email already registered")

        existing_user_by_email = self.user_repository.get_by_email(str(payload.email))
        if existing_user_by_email is not None:
            raise CompanyAlreadyExistsError("Email already registered by a user")

        hashed_password = self.password_service.hash_password(payload.password)
        company = Company(
            name=payload.name,
            email=str(payload.email),
            hashed_password=hashed_password,
        )
        return self.company_repository.create(company)

    def get_company(self, company_id: uuid.UUID) -> Company:
        company = self.company_repository.get_by_id(company_id)
        if company is None:
            raise CompanyNotFoundError("Company not found")
        return company
