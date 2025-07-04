# time tools

from datetime import datetime
import uuid
import base64
import pandas as pd


def generate_opaque_id():
    uid = uuid.uuid4()
    encoded = base64.urlsafe_b64encode(uid.bytes).decode('utf-8')
    return encoded.rstrip('=')[:80]

def get_hour_difference(old_epoch):
    epoch = datetime.now()
    now = old_epoch
    delta = now - epoch
    t_hours = delta.total_seconds() / 3600  # Convert seconds to hours
    t_hours = round(t_hours,2) # easy to reference half hours here
    return t_hours

def time_difference(x):
    seconds = x * 3600

    if seconds < 60:
        return "just now"
    elif seconds < 1800:
        return "less than 30 minutes ago"
    elif seconds < 3600:
        return "about 30 minutes ago"
    elif seconds < 7200:
        return "1 hour ago"
    elif seconds < 86400:
        hours = round(seconds / 3600)
        return f"{hours} hours ago"
    elif seconds < 172800:
        return "1 day ago"
    else:
        days = round(seconds / 86400)
        return f"{days} days ago"

def timestamp():
    today = datetime.now()
    formatted_date = today.strftime("%d %b %Y")
    return (formatted_date)

import pandas as pd
from datetime import datetime



