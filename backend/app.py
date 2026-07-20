from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from user_router import user_router
from auth_router import auth_router
from wifi import wifi_router
from listing_router import listing_router
from helloasso import helloasso_router

# TODO : passer à l'utilisation du certificat letsencrypt : il suffit de changer le fichier
#profile_file = "Rézal.mobileconfig"
profile_file = "Rézal-lets.mobileconfig"

app = FastAPI(
    root_path="/api"
)

#TODO fort : Mettre une origine qui est juste notre site, on n'est pas censé pouvoir utiliser l'API depuis n'importe où
app.add_middleware(
    CORSMiddleware,
    allow_origins = [
    # prod
    "https://www.rezal-mdm.com",
    "https://rezal-mdm.com",
    
    # local
    "http://localhost:5173",
    "http://localhost:3000",
],
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
async def get_apple_profile ():
    return FileResponse (profile_file, media_type='application/octet-stream',filename=profile_file)

@app.get ("/my_ip")
async def my_ip (request: Request):
    client_ip = request.client.host
    return {"client_ip": client_ip} 