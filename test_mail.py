import smtplib, ssl
import os
from dotenv import load_dotenv

# Lire le fichier .env et le rendre accessible dans les variables d'environnement
load_dotenv ()
SMTP_HOST = os.getenv ("SMTP_HOST")
SMTP_USERNAME = os.getenv ("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv ("SMTP_PASSWORD")
SMTP_PORT = 587
print(SMTP_HOST, SMTP_PASSWORD, SMTP_USERNAME)

var = 1

sender = SMTP_USERNAME
to = "gregoire.girardet@etu.minesparis.psl.eu"
message = f"""\
Subject: Test

This message is sent from Python.{var}"""

context = ssl.create_default_context()

server = smtplib.SMTP ()
server.connect (SMTP_HOST, SMTP_PORT)
server.helo()
server.starttls (context=context)
server.helo()
server.login (SMTP_USERNAME, SMTP_PASSWORD)

msg = MIMEText ('%s - %s' % (msg.text, msg.channel))
msg['Subject'] = "msg.channel"
msg['From'] = sender
msg['To'] = to
server.sendmail(msg.get('From'), msg["To"], msg.as_string())
server.quit()


# Référence pour les mails avec gandi : https://docs.gandi.net/fr/gandimail/configuration_messagerie/index.html
# context = ssl.create_default_context()
# with smtplib.SMTP_SSL (SMTP_HOST, SMTP_HOST, context=context) as smtp_server:
#     smtp_server.login (SMTP_USERNAME, SMTP_PASSWORD)
#     smtp_server.sendmail (sender, to, message)


# Import the email modules we'll need
from email.message import EmailMessage


# me == the sender's email address
# you == the recipient's email address
# msg['Subject'] = f'The contents of {textfile}'
# msg['From'] = "me"
# msg['To'] = "you"
# print(msg)
# Send the message via our own SMTP server.
# s = smtplib.SMTP('localhost')
# s.send_message(msg)
# s.quit()