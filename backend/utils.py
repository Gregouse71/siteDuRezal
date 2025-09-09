from datetime import datetime, timedelta, timezone
import jwt

def create_access_token(data: dict, key: str, algorithm: str, expires_delta: timedelta | None = None) -> str:
    """
    Crée un jeton d'accès à partir des données de *data*, valide pour une durée *expires_delta*
    data ne doit pas contenir de clé *exp*
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta  # on calcule la date d'expiration
    else:  # si elle n'est pas demandée, c'est 15 min
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})  # On ajoute la date d'expiration aux données du jeton
    encoded_jwt = jwt.encode(to_encode, key, algorithm=algorithm)  # et on les encode
    return encoded_jwt