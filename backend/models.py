from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_caching import Cache
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from datetime import datetime, timezone
#import the module to calculate time ago or assign it directly


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 0
app.config["JWT_SECRET_KEY"] = "@as5XIUdc"
app.config["JWT_BLACKLIST_ENABLED"] = True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]
jwt = JWTManager(app)
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None
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


class User(db.Model):
    username = db.Column(db.String(50), nullable=False)
    uuid = db.Column(db.String(200), primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    pfp = db.Column(db.LargeBinary, nullable=True)
    followers= db.Column(db.Integer, nullable=False, default=0)
    posts = db.relationship('Blog', backref='user', lazy=True)
    logged = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, username, email, password, uuid):
        self.username = username
        self.email = email
        self.password = password
        self.uuid = uuid


class Blog(db.Model):
    pid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(50), db.ForeignKey('user.username'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    views = db.Column(db.Integer, nullable=False, default=0)
    likes = db.Column(db.Integer, nullable=False, default=0)
    posted_on = db.Column(db.String, nullable=False)


    def __init__(self, author, category, content, title, posted_on):
        self.author = author
        self.category = category
        self.content = content
        self.title = title
        self.posted_on = posted_on
        self.desc = self.generate_description(content)

    def generate_description(self, content):
        words = content.split()
        return " ".join(words[:50]) + "..." if len(words) > 50 else content

class InteractionTracker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer)
    ip_address = db.Column(db.String(100))
    interaction_type = db.Column(db.String(10))

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50), db.ForeignKey('user.username'), nullable=False)
    content = db.Column(db.LargeBinary , nullable=False)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)






