from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from user_router import user_router
from auth_router import auth_router
from wifi import wifi_router
from listing_router import listing_router
from helloasso import helloasso_router

profile_file = "Rézal.mobileconfig"

app = FastAPI(
    root_path="/api"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router (user_router)
app.include_router (auth_router)
app.include_router (wifi_router)
app.include_router (listing_router)
app.include_router (helloasso_router)

@app.get ("/is_alive")
async def is_alive () -> bool:
    return True

@app.get ("/apple_profile")
async def get_apple_profile () -> bool:
    return FileResponse (profile_file, media_type='application/octet-stream',filename=profile_file)
