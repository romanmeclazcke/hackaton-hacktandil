from src.core.exceptions.exceptions import InvalidCredentialsError
from src.repositories.company_repository import CompanyRepository
from src.repositories.user_repository import UserRepository
from src.schemas.auth import LoginRequest, LoginResponse
from src.services.password_service import PasswordService
from src.services.token_service import TokenService


class AuthService:
    def __init__(self, db) -> None:
        self.user_repository = UserRepository(db)
        self.company_repository = CompanyRepository(db)
        self.password_service = PasswordService()
        self.token_service = TokenService()

    def login(self, payload: LoginRequest) -> LoginResponse:
        email = str(payload.email)

        user = self.user_repository.get_by_email(email)
        if user is not None and self.password_service.verify_password(payload.password, user.hashed_password):
            access_token, expires_at = self.token_service.create_access_token(
                {
                    "sub": str(user.id),
                    "email": user.email,
                    "account_type": "user",
                    "user_id": user.id,
                    "company_id": None,
                }
            )
            return LoginResponse(
                access_token=access_token,
                account_type="user",
                user_id=user.id,
                company_id=None,
                expires_at=expires_at,
            )

        company = self.company_repository.get_by_email(email)
        if company is not None and self.password_service.verify_password(payload.password, company.hashed_password):
            access_token, expires_at = self.token_service.create_access_token(
                {
                    "sub": str(company.id),
                    "email": company.email,
                    "account_type": "company",
                    "user_id": None,
                    "company_id": company.id,
                }
            )
            return LoginResponse(
                access_token=access_token,
                account_type="company",
                user_id=None,
                company_id=company.id,
                expires_at=expires_at,
            )

        raise InvalidCredentialsError("Invalid email or password")
