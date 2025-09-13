from fastapi import Depends, HTTPException, status, APIRouter, Request
from sqlmodel import SQLModel, Session, select

from database import User, engine, UserUpdate, patch_user_db

helloasso_router = APIRouter (
    prefix="/helloasso"
)

@helloasso_router.post ("")
async def post_helloasso (
    request: Request
):
    req = await request.json ()
    data = req["data"]
    if not (
        req["eventType"] == "Payment"
        and data["cashOutState"] == "Transfered"
    ):
        pass
    else:
        with Session (engine) as session:
            statement = select (User).where (User.email == data["payer"]["email"])
            user = session.exec (statement).one ()
            user.credits = len(data["items"]) * 5
            session.add (user)
            session.commit ()
            print ("done")

    return True