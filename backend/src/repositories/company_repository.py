import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.company import Company


class CompanyRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, company: Company) -> Company:
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def get_by_id(self, company_id: uuid.UUID) -> Company | None:
        return self.db.get(Company, company_id)

    def get_by_email(self, email: str) -> Company | None:
        statement = select(Company).where(Company.email == email)
        return self.db.scalar(statement)

    def get_by_name(self, name: str) -> Company | None:
        statement = select(Company).where(Company.name == name)
        return self.db.scalar(statement)
