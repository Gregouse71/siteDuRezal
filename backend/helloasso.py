from fastapi import Depends, HTTPException, status, APIRouter

helloasso_router = APIRouter (
    prefix="/helloasso"
)

@helloasso_router.post ("")
def post_helloasso (
    data
):
    print (data)