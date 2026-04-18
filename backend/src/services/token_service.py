import base64
import hashlib
import hmac
import json
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from src.core.config import settings


class TokenService:
    def __init__(self) -> None:
        if settings.jwt_algorithm != "HS256":
            raise ValueError("Only HS256 is supported")

        self.secret_key = settings.jwt_secret_key.encode("utf-8")
        self.algorithm = settings.jwt_algorithm
        self.expire_minutes = settings.jwt_expire_minutes

    def create_access_token(self, payload: dict[str, Any]) -> tuple[str, datetime]:
        expires_at = datetime.now(UTC) + timedelta(minutes=self.expire_minutes)
        token_payload = {
            **payload,
            "exp": int(expires_at.timestamp()),
            "iat": int(datetime.now(UTC).timestamp()),
        }
        token = self._encode(token_payload)
        return token, expires_at

    def _encode(self, payload: dict[str, Any]) -> str:
        header = {"alg": self.algorithm, "typ": "JWT"}
        encoded_header = self._base64url_encode(header)
        encoded_payload = self._base64url_encode(payload)
        signing_input = f"{encoded_header}.{encoded_payload}"
        signature = hmac.new(
            self.secret_key,
            signing_input.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        encoded_signature = base64.urlsafe_b64encode(signature).rstrip(b"=").decode("utf-8")
        return f"{signing_input}.{encoded_signature}"

    def _base64url_encode(self, value: dict[str, Any]) -> str:
        normalized_value = self._normalize(value)
        raw = json.dumps(normalized_value, separators=(",", ":"), sort_keys=True).encode("utf-8")
        return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("utf-8")

    def _normalize(self, value: Any) -> Any:
        if isinstance(value, uuid.UUID):
            return str(value)
        if isinstance(value, datetime):
            return value.isoformat()
        if isinstance(value, dict):
            return {key: self._normalize(item) for key, item in value.items()}
        if isinstance(value, list):
            return [self._normalize(item) for item in value]
        return value
