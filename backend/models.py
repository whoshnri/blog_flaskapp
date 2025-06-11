from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_caching import Cache
from datetime import datetime, timezone


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 0
cache = Cache(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)


# --- Password Hashing ---
def hash_password(string):
    return bcrypt.generate_password_hash(string).decode('utf-8')

# --- Password unHashing
def verify_password(plain_password, hashed_password):
    return bcrypt.check_password_hash(hashed_password, plain_password)


# --- Models ---
class User(db.Model):
    username = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    pfp = db.Column(db.LargeBinary, nullable=True)
    posts = db.relationship('Blog', backref='user', lazy=True)

    def __init__(self, username, email, password, pfp=None):
        self.username = username
        self.email = email
        self.password = password
        self.pfp = pfp


class Blog(db.Model):
    pid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(50), db.ForeignKey('user.username'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    views = db.Column(db.Integer, nullable=False, default=0)
    likes = db.Column(db.Integer, nullable=False, default=0)


    def __init__(self, author, category, content, title, timestamp):
        self.author = author
        self.category = category
        self.content = content
        self.title = title
        self.timestamp = timestamp
        self.desc = self.generate_description(content)

    def generate_description(self, content):
        words = content.split()
        return " ".join(words[:50]) + "..." if len(words) > 50 else content

class InteractionTracker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer)
    ip_address = db.Column(db.String(100))
    interaction_type = db.Column(db.String(10))  # 'like' or 'view'


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)






