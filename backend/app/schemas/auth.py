from typing import Optional, Any
from pydantic import BaseModel, EmailStr, Field

class UserRegisterInput(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str
    full_name: Optional[str] = None
    name: Optional[str] = None  # alias for full_name
    taluk: Optional[str] = "Puttur"
    role: Optional[str] = "farmer"
    phone: Optional[str] = None

    class Config:
        extra = "allow"

class UserLoginInput(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

    class Config:
        extra = "allow"

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    taluk: str
    role: str
    phone: Optional[str] = None
    created_at: str

class AuthTokenResponse(BaseModel):
    success: bool = True
    access_token: str
    token: Optional[str] = None
    accessToken: Optional[str] = None
    token_type: str = "bearer"
    user: UserResponse
    data: Optional[Any] = None
    message: str = "Authentication successful"

    class Config:
        extra = "allow"

