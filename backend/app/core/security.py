from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def normalize_password(password: str):
    return hashlib.sha256(password.strip().encode()).hexdigest()


def hash_password(password: str):
    return pwd_context.hash(normalize_password(password))


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(normalize_password(password), hashed_password)