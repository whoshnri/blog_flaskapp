#contains database models

from config import db

class Contact(db.Model):
    id = db.Column(db.integer , primary_key =True)
    firstname = db.Column(db.String(80), nullable=True, unique=False)
    lastname = db.Column(db.String(80), nullable=True, unique=False)
    email = db.Column(db.String(100), nullable=True, unique=True)


    #converts the db table to a py object and then to a json format that is readable by the frontend through the API
    def to_json(self):
        return {
            'id' : self.id,
            'firstName' : self.firstname,
            'lastName' : self.lastname,
            'email' : self.email
        }


