"""Clerk JWT verification for FastAPI."""

from __future__ import annotations

import logging

import httpx
from fastapi import Request, HTTPException
from jose import jwt, jwk, JWTError

from app.config import get_settings

logger = logging.getLogger(__name__)

_CLERK_JWKS_CACHE: dict = {}
_CLERK_JWKS_URL_CACHE: str = ""


def _get_jwks() -> dict:
    """Fetch and cache Clerk's JWKS keys."""
    global _CLERK_JWKS_CACHE, _CLERK_JWKS_URL_CACHE
    s = get_settings()
    if not s.clerk_issuer:
        return {}
    url = f"{s.clerk_issuer}/.well-known/jwks.json"
    if url == _CLERK_JWKS_URL_CACHE and _CLERK_JWKS_CACHE:
        return _CLERK_JWKS_CACHE
    try:
        resp = httpx.get(url, timeout=10)
        resp.raise_for_status()
        _CLERK_JWKS_CACHE = resp.json()
        _CLERK_JWKS_URL_CACHE = url
        return _CLERK_JWKS_CACHE
    except Exception:
        logger.exception("Failed to fetch Clerk JWKS")
        return _CLERK_JWKS_CACHE


def verify_clerk_token(request: Request) -> str | None:
    """Extract and verify Clerk session JWT. Returns user_id or None."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:]
    s = get_settings()
    if not s.clerk_issuer or not s.clerk_secret_key:
        return None
    try:
        jwks = _get_jwks()
        if not jwks:
            return None

        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        key_data = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
        if not key_data:
            return None

        public_key = jwk.construct(key_data)
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            issuer=s.clerk_issuer,
        )
        return payload.get("sub")
    except JWTError:
        return None


async def require_auth(request: Request) -> str:
    """FastAPI dependency — returns user_id or raises 401."""
    user_id = verify_clerk_token(request)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id
