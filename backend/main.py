from flask import requests,jsonify
from config import app, db
from models import Contact
#creating

def create_contact( id, firstname, lastname,email):


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
