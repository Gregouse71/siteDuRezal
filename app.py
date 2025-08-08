from typing import Annotated
from fastapi import FastAPI, Depends

from database import User

from user_manip import user_router
from authentication import auth_router, get_current_user


app = FastAPI(root_path="/api")

app.include_router (user_router)
app.include_router (auth_router)

@app.get ("/is_alive")
def is_alive ():
    return True

@app.get("/user/me/")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
