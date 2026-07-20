from fastapi import APIRouter, Request
from sqlmodel import Session, select

from database import User, engine

helloasso_router = APIRouter (
    prefix="/helloasso"
)

@helloasso_router.post ("")
async def post_helloasso (
    request: Request
):
    req = await request.json ()
    data = req.get("data")
    if not (
        req.get("eventType") == "Payment"
        and data.get("cashOutState") == "Transfered"
        and request.client.host == "51.138.206.200"
    ):
        print(f"Mauvaise ip : {request.client.host}")
        pass
    else:
        with Session (engine) as session:
            statement = select (User).where (User.email == data["payer"]["email"])
            user = session.exec (statement).all ()
            if not user:
                print("No user found   ", data["payer"]["email"])
                return True
            user = user[0]
            user.credits = len(data["items"])
            session.add (user)
            session.commit ()
            print ("done")

    return True
