import uuid

from sqlalchemy.orm import Session

from src.models.user import User
from src.core.exceptions.exceptions import UserAlreadyExistsError, UserNotFoundError
from src.repositories.user_repository import UserRepository
from src.schemas.user import UserCreate
from src.services.password_service import PasswordService

class UserService:
    def __init__(self, db: Session) -> None:
        self.repository = UserRepository(db)
        self.password_service = PasswordService()

    def create_user(self, payload: UserCreate):
        existing_email = self.repository.get_by_email(str(payload.email))
        if existing_email is not None:
            raise UserAlreadyExistsError("Email already registered")


        hashed_password = self.password_service.hash_password(payload.password)

        user = User(
            name=payload.name,
            lastnames=payload.lastnames,
            email=str(payload.email),
            hashed_password=hashed_password
        )
        return self.repository.create(user)

    def get_user(self, user_id: uuid.UUID):
        user = self.repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError("User not found")
        return user


    def verify_user_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.password_service.verify_password(plain_password, hashed_password)
