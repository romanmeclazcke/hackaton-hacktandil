from src.core.database import Base, engine
from src.models.company import Company
from src.models.user import User


def init_db() -> None:
    _ = Company
    _ = User
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
