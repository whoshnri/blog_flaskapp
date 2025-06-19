from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_caching import Cache
from tools import timestamp
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from datetime import datetime, timezone, timedelta
from slugify import slugify
import re
import os
from dotenv import load_dotenv
from sqlalchemy import event
from sqlalchemy.exc import OperationalError, SQLAlchemyError
import time
import random

load_dotenv()

# Application Factory
def create_app():
    app = Flask(__name__, static_folder="./frontend/dist", static_url_path="")

    # Database Configuration
    db_url = os.environ.get('DATABASE_URL')
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
        "pool_size": 5,
        "max_overflow": 10,
        "pool_timeout": 30,
    }

    # Other Configurations
    app.config['CACHE_TYPE'] = 'SimpleCache'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 0
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "@as5XIUdc")
    app.config["JWT_BLACKLIST_ENABLED"] = True
    app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)

    return app

# Initialize App
app = create_app()

# Initialize Extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)
cache = Cache(app)
jwt = JWTManager(app)

# Database Connection Retry Logic
def execute_with_retry(session, query, max_retries=3, initial_delay=0.5):
    last_exception = None
    for attempt in range(max_retries):
        try:
            return query()
        except (OperationalError, SQLAlchemyError) as e:
            last_exception = e
            session.rollback()
            if attempt < max_retries - 1:
                sleep_time = initial_delay * (2 ** attempt) + random.uniform(0, 0.5)
                time.sleep(sleep_time)
                session.remove()
                try:
                    session.execute("SELECT 1")  # Test connection
                except:
                    continue
    raise last_exception

# Token Blocklist Check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    try:
        return execute_with_retry(
            db.session,
            lambda: db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None
        )
    except Exception:
        return True  # Fail safe - treat as revoked if we can't verify

# Password Hashing Utilities
def hash_password(string):
    return bcrypt.generate_password_hash(string).decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.check_password_hash(hashed_password, plain_password)

# Database Models
class User(db.Model):
    __tablename__ = 'users'

    username = db.Column(db.String(50), nullable=False, unique=True)
    uuid = db.Column(db.String(200), primary_key=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    pfp = db.Column(db.LargeBinary, nullable=True)
    logged = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    posts = db.relationship('Blog', backref='author_ref', lazy='dynamic')
    images = db.relationship('Images', backref='user_ref', lazy='dynamic')

    def __init__(self, username, email, password, uuid):
        self.username = username
        self.email = email
        self.password = password
        self.uuid = uuid

class Blog(db.Model):
    __tablename__ = 'blogs'

    id = db.Column(db.Integer, primary_key=True)
    pid = db.Column(db.String(200), unique=True)
    title = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(50), db.ForeignKey('users.username'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    views = db.Column(db.Integer, nullable=False, default=0)
    likes = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    posted_on = db.Column(db.String, nullable=False)

    # Relationships
    interactions = db.relationship('InteractionTracker', backref='blog_ref', lazy='dynamic')

    def __init__(self, author, category, content, title, posted_on):
        self.author = author
        self.category = category
        self.content = content
        self.title = title
        self.posted_on = posted_on
        self.pid = slugify(title)
        self.desc = self.generate_description(content)

    def generate_description(self, content):
        # Remove HTML tags if present
        clean_text = re.sub(r'<[^>]+>', '', content)
        words = clean_text.strip().split()
        return " ".join(words[:50]) + "..." if len(words) > 50 else clean_text

class InteractionTracker(db.Model):
    __tablename__ = 'interactions'

    id = db.Column(db.Integer, primary_key=True)
    blog_pid = db.Column(db.String, db.ForeignKey('blogs.pid'))
    ip_address = db.Column(db.String(100))
    day = db.Column(db.String, nullable=False)
    interaction_type = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    __table_args__ = (
        db.Index('ix_interaction_unique', 'blog_pid', 'ip_address', 'day', 'interaction_type', unique=True),
    )

    def __init__(self, blog_pid, ip_address, interaction_type):
        self.blog_pid = blog_pid
        self.ip_address = ip_address
        self.interaction_type = interaction_type
        self.day = timestamp()

class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Images(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50), db.ForeignKey('users.username'), nullable=False)
    content = db.Column(db.LargeBinary, nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    mime_type = db.Column(db.String(50), nullable=False)

# Database Event Listeners
@event.listens_for(db.engine, "engine_connect")
def configure_connection(dbapi_connection, connection_record):
    # Set statement timeout to 30 seconds
    cursor = dbapi_connection.cursor()
    cursor.execute("SET statement_timeout TO 30000;")
    cursor.close()

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database tables: {str(e)}")
    app.run(debug=True)
