
from fastapi import APIRouter, HTTPException, Depends, Header, Request, status
from typing import Optional, Dict, Any

from ..schemas.auth import UserRegisterInput, UserLoginInput, AuthTokenResponse, UserResponse
from ..services.auth_service import auth_service

auth_router = APIRouter()

async def get_current_user(request: Request, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    raw_token = None
    if authorization:
        if authorization.startswith("Bearer "):
            raw_token = authorization.split(" ", 1)[1].strip()
        else:
            raw_token = authorization.strip()
    
    # Check cookies or query params as fallback
    if not raw_token:
        raw_token = request.cookies.get("token") or request.cookies.get("access_token") or request.query_params.get("token")

    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = auth_service.verify_token(raw_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired or is invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = auth_service.get_user_by_id(payload["sub"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@auth_router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: Request):
    # Support both JSON payload and Form payload flexibly
    content_type = request.headers.get("content-type", "")
    try:
        if "application/json" in content_type:
            data = await request.json()
        elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
            form = await request.form()
            data = dict(form)
        else:
            try:
                data = await request.json()
            except Exception:
                form = await request.form()
                data = dict(form)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid request body: {str(e)}")

    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    full_name = data.get("full_name") or data.get("name")
    taluk = data.get("taluk", "Puttur")
    role = data.get("role", "farmer")
    phone = data.get("phone")

    if not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password is required")

    try:
        res = auth_service.register_user(
            email=email,
            username=username,
            password=password,
            full_name=full_name,
            taluk=taluk,
            role=role,
            phone=phone
        )
        token = res["token"]
        user_obj = UserResponse(**res["user"])
        return AuthTokenResponse(
            success=True,
            access_token=token,
            token=token,
            accessToken=token,
            token_type="bearer",
            user=user_obj,
            data={"user": user_obj.model_dump(), "token": token},
            message="User registered successfully"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Registration error: {str(e)}")

@auth_router.post("/login", response_model=AuthTokenResponse)
async def login(request: Request):
    content_type = request.headers.get("content-type", "")
    try:
        if "application/json" in content_type:
            data = await request.json()
        elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
            form = await request.form()
            data = dict(form)
        else:
            try:
                data = await request.json()
            except Exception:
                form = await request.form()
                data = dict(form)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid request body: {str(e)}")

    login_identifier = data.get("email") or data.get("username")
    password = data.get("password")

    if not login_identifier or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username/Email and password are required")

    try:
        res = auth_service.authenticate_user(login_identifier=login_identifier, password=password)
        token = res["token"]
        user_obj = UserResponse(**res["user"])
        return AuthTokenResponse(
            success=True,
            access_token=token,
            token=token,
            accessToken=token,
            token_type="bearer",
            user=user_obj,
            data={"user": user_obj.model_dump(), "token": token},
            message="Login successful"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Login error: {str(e)}")

@auth_router.get("/me")
async def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    user_dict = dict(user)
    return {
        **user_dict,
        "user": user_dict,
        "data": user_dict
    }

@auth_router.post("/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}

users_router = APIRouter()

@users_router.get("/me")
async def get_user_me(user: Dict[str, Any] = Depends(get_current_user)):
    user_dict = dict(user)
    return {
        **user_dict,
        "user": user_dict,
        "data": user_dict
    }

@users_router.patch("/me", response_model=UserResponse)
@users_router.put("/me", response_model=UserResponse)
async def update_user_me(request: Request, user: Dict[str, Any] = Depends(get_current_user)):
    data = await request.json()
    with auth_service._get_connection() as conn:
        cursor = conn.cursor()
        full_name = data.get("full_name", user["full_name"])
        taluk = data.get("taluk", user["taluk"])
        role = data.get("role", user["role"])
        phone = data.get("phone", user["phone"])
        cursor.execute("""
            UPDATE users SET full_name = ?, taluk = ?, role = ?, phone = ?
            WHERE id = ?
        """, (full_name, taluk, role, phone, user["id"]))
        conn.commit()
    updated = auth_service.get_user_by_id(user["id"])
    return UserResponse(**updated)

@users_router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: int):
    u = auth_service.get_user_by_id(user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**u)


