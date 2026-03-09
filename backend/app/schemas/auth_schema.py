from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):

    name: str
    email: EmailStr
    password: str
    profile: str | None = None


class LoginSchema(BaseModel):
    
    email: EmailStr
    password: str