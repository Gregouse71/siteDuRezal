from fastapi import FastAPI

from user_router import user_router
from authentication import auth_router
from wifi import wifi_router
from user_listing import listing_router

app = FastAPI(root_path="/api")

app.include_router (user_router)
app.include_router (auth_router)
app.include_router (wifi_router)
app.include_router (listing_router)

@app.get ("/is_alive")
async def is_alive () -> bool:
    return True

