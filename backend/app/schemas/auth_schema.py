from pydantic import BaseModel, EmailStr, field_validator
import re


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name is required")
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class VerifyOtpSchema(BaseModel):
    email: EmailStr
    otp: str

    @field_validator("otp")
    @classmethod
    def otp_digits(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 6:
            raise ValueError("OTP must be exactly 6 digits")
        return v


class ResendOtpSchema(BaseModel):
    email: EmailStr


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserSchema(BaseModel):
    id: int
    name: str
    email: str
    is_verified: bool
    profile: str | None
    auth_provider: str

    model_config = {"from_attributes": True}
