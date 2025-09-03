from mail import send_mail
from database import get_user_db

greg = get_user_db ("24girardet")[0]
send_mail (greg)
