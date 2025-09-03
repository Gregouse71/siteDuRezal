from backend.mail import send_mail
from backend.database import get_user_db

greg = get_user_db ("24girardet")
send_mail (greg)