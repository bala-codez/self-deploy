from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def login():
    return {"message": "Welcome"}

@router.post("/login")
def login():
    return {"message": "Welcome"}