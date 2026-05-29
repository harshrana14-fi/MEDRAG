from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from config import config
from models.schemas import User, UserCreate, Token
from services.auth import authenticate_user, create_access_token, get_password_hash
from services.mongodb import mongodb_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=User)
async def signup(user_in: UserCreate):
    # Check if user exists
    existing_user = await mongodb_service.db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists."
        )
    
    # Hash password and save
    hashed_password = get_password_hash(user_in.password)
    user_dict = {
        "email": user_in.email,
        "full_name": user_in.full_name,
        "hashed_password": hashed_password,
        "disabled": False
    }
    
    await mongodb_service.db.users.insert_one(user_dict)
    return user_dict

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await mongodb_service.db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Helper function (to be moved to services/auth.py or kept here if needed)
from services.auth import verify_password
