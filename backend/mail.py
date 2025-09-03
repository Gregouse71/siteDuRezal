import smtplib
import os
from dotenv import load_dotenv
from email.mime.text import MIMEText

from database import User

# Lire le fichier .env et le rendre accessible dans les variables d'environnement
load_dotenv ()
SMTP_HOST = os.getenv ("SMTP_HOST")
SMTP_USERNAME = os.getenv ("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv ("SMTP_PASSWORD")
SMTP_PORT = 587

sender = SMTP_USERNAME
message = """\
Subject: Test

This message is sent from Python.
Click this link : http://10.20.1.80:3000/{0}/{1}"""


# Référence pour les mails avec gandi : https://docs.gandi.net/fr/gandimail/configuration_messagerie/index.html
def send_mail (user: User):
    server = smtplib.SMTP (SMTP_HOST, SMTP_PORT)
    server.starttls ()
    server.ehlo()
    server.login (SMTP_USERNAME, SMTP_PASSWORD)

    token = create_access_token(
        data={"sub": user.uid},
        key=SECRET_KEY_MAIL,
        expires_delta=timedelta (minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    msg = MIMEText (message.format (user.uid, token), 'plain')
    msg['Subject'] = "Message de test"
    msg['From'] = sender
    msg['To'] = user.email
    server.sendmail(sender, user.email, msg.as_string())
    server.quit()
    pass