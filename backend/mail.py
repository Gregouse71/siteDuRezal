import smtplib
import os
from dotenv import load_dotenv
from email.mime.text import MIMEText
from auth_router import SECRET_KEY_MAIL, create_access_token

from database import User

# Lire le fichier .env et le rendre accessible dans les variables d'environnement
load_dotenv ()
SMTP_HOST = os.getenv ("SMTP_HOST")
SMTP_USERNAME = os.getenv ("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv ("SMTP_PASSWORD")
SMTP_PORT = 587

sender = SMTP_USERNAME

# Référence pour les mails avec gandi : https://docs.gandi.net/fr/gandimail/configuration_messagerie/index.html
def send_mail (user: User, contenu: str, subject: str, token: str):
    server = smtplib.SMTP (SMTP_HOST, SMTP_PORT)
    server.starttls ()
    server.ehlo()
    server.login (SMTP_USERNAME, SMTP_PASSWORD)

    msg = MIMEText (message_premiere_co.format (user.prenom, user.uid, token), 'html')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = user.email
    server.sendmail(sender, user.email, msg.as_string())
    server.quit()


def send_premier_mail (user: User):
    token = create_access_token(
        data={"sub": user.uid},
        key=SECRET_KEY_MAIL,
    )

    send_mail (user, message_premiere_co, "Création de compte Rézal", token)


def send_nouveau_mail (user: User):
    token = create_access_token(
        data={"sub": user.uid},
        key=SECRET_KEY_MAIL,
    )
    send_mail (user, message_mdp, "Rézal : mot de passe oublié", token)


message_premiere_co = """\
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Bienvenue au Rézal!</title>
<style type="text/css">h2, h4 {{ font-family: Arial, Helvetica, sans-serif; }}</style>
</head>
<div>
    <h2>Bienvenue au Rézal, {0}  !</h2>
    <p>Note bien que <strong>tu ne pourras pas te connecter ni à ton compte ni au réseau tant que ton adresse ne sera pas vérifiée.</strong></p>
    <p><a href="http://www.rezal-mdm.com/resident/verify-email/{1}/{2}">Clique ici pour verifier ton email !</a>
    
    <p>Nous te rappelons que l'usage d'internet à la résidence se doit de respecter la loi, notamment <strong>l'interdiction de téléchargement illégal de films en Torrent.</strong> 
    Comme écrit dans notre charte, l'association a la charge du bon fonctionnement du réseau et peut t'interdire l'accès en cas d'utilisation frauduleuse.</p>
    <p>Si tu as un problème avec le réseau, tu peux nous contacter par mail sur l'adresse admin.</p>
    

    <a href="mailto:admin@rezal-mdm.com">admin@rezal-mdm.com</a>
</div>
"""

message_mdp = """\
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Mot de passe oublié</title>
<style type="text/css">h2, h4 {{ font-family: Arial, Helvetica, sans-serif; }}</style>
</head>
<div>
    <h2>{0}, tu as oublié ton mot de passe Rézal et c'est mal !</h2>
    <p>Ne t'avise pas de recommencer</p>
    <p><a href="http://www.rezal-mdm.com/resident/new_password/{2}">Clique ici pour en obtenir un nouveau.</a>

    <a href="mailto:admin@rezal-mdm.com">admin@rezal-mdm.com</a>
</div>
"""