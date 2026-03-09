from fastapi import APIRouter

router = APIRouter(prefix="/oauth", tags=["auth"])

@router.get("/google")
def login():
    pass
