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

def add_to_sheet(email, feedback, rating):
    # Load existing CSV or create a new DataFrame if it doesn't exist
    try:
        df = pd.read_csv("./feedback.csv")
    except FileNotFoundError:
        df = pd.DataFrame(columns=["email", "feedback", "rating", "timestamp"])

    # Create a new DataFrame for the new feedback row
    new_row = pd.DataFrame([{
        "email": email,
        "feedback": feedback,
        "rating": rating,
        "timestamp": datetime.now().isoformat()
    }])

    # Concatenate the new row
    df = pd.concat([df, new_row], ignore_index=True)

    # Save the updated DataFrame back to the CSV
    df.to_csv("./feedback.csv", index=False)
    return 200


def add_to_sheet_one(email):
    # Load existing CSV or create a new DataFrame if it doesn't exist
    try:
        df = pd.read_csv("./emaillist.csv")
    except FileNotFoundError:
        df = pd.DataFrame(columns=["email"])

    # Create a new DataFrame for the new row
    new_row = pd.DataFrame({"email": [email]})

    # Concatenate the old and new data
    df = pd.concat([df, new_row], ignore_index=True)

    # Save the updated DataFrame back to the CSV
    df.to_csv("./emaillist.csv", index=False)
    return 200

