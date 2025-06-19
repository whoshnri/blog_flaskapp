from models import User, Blog, app, db, hash_password, verify_password, cache, InteractionTracker
from sqlalchemy import func, create_engine
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker
from flask import jsonify, request, send_from_directory
from tools import timestamp, time_difference, generate_opaque_id, add_to_sheet, add_to_sheet_one
from datetime import datetime
from models import create_access_token, get_jwt_identity, jwt_required, TokenBlocklist, get_jwt
from slugify import slugify
import os
import random
import time
from functools import wraps

# Database Engine Configuration
def create_db_engine():
    return create_engine(
        app.config['SQLALCHEMY_DATABASE_URI'],
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300,
        connect_args={
            "keepalives": 1,
            "keepalives_idle": 30,
            "keepalives_interval": 10,
            "keepalives_count": 5,
            "sslmode": "require"
        }
    )

engine = create_db_engine()
db_session = scoped_session(sessionmaker(bind=engine))

# Database Connection Retry Decorator
def with_db_retry(retries=3, delay=1):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(retries):
                try:
                    return f(*args, **kwargs)
                except (OperationalError, SQLAlchemyError) as e:
                    last_exception = e
                    db.session.rollback()
                    if attempt < retries - 1:
                        sleep_time = delay * (2 ** attempt) + random.uniform(0, 0.5)
                        time.sleep(sleep_time)
                        # Refresh the connection
                        db.session.remove()
                        try:
                            db.session.execute("SELECT 1")
                        except:
                            continue
            raise last_exception
        return wrapper
    return decorator

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

# Health Check Endpoint
@app.route("/health")
def health_check():
    try:
        db_session.execute("SELECT 1")
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# User Routes
@app.route("/users", methods=["GET"])
@with_db_retry()
def get_users():
    users = db_session.query(User).all()
    return jsonify([{
        "username": u.username,
        "email": u.email,
        "displayPhoto": str(u.pfp),
        "uuid": u.uuid,
        "post_count": len(u.posts),
        "view_count": sum(post.views for post in u.posts),
        "like_count": sum(post.likes for post in u.posts)
    } for u in users])

@app.route("/new/user", methods=["POST"])
@with_db_retry()
def create_user():
    data = request.get_json()
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"message": "missing fields"}), 400

    unique_id = generate_opaque_id()
    while db_session.query(User).filter_by(uuid=unique_id).first():
        unique_id = generate_opaque_id()

    new_user = User(
        username=data["username"],
        email=data["email"],
        password=hash_password(data["password"]),
        uuid=unique_id
    )

    db_session.add(new_user)
    db_session.commit()
    return jsonify({"message": "User created successfully"}), 201

# Authentication Routes
@app.route("/get/user", methods=['POST'])
@with_db_retry()
def log_user():
    data = request.get_json()
    user = db_session.query(User).filter_by(email=data['email']).first()

    if not user:
        return jsonify({"message": "Invalid Email", "status": 401}), 401

    if verify_password(data["password"], user.password):
        access_token = create_access_token(identity=user.uuid)
        return jsonify({
            "message": "Login Successful",
            "token": access_token,
            "username": user.username,
            "uuid": user.uuid
        }), 200
    return jsonify({"message": "Password Invalid", "status": 402}), 401

@app.route("/logout", methods=["POST"])
@jwt_required()
@with_db_retry()
def logout():
    jti = get_jwt()["jti"]
    db_session.add(TokenBlocklist(jti=jti))
    db_session.commit()
    return jsonify({"message": "Successfully logged out", "status": 200}), 200

# Blog Routes
@app.route("/get/blogs", methods=["GET"])
@with_db_retry()
def get_blogs():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 4))

    query = db_session.query(Blog).order_by(Blog.posted_on.desc())
    total = query.count()
    offset = (page - 1) * limit
    blogs = query.offset(offset).limit(limit).all()
    remaining = total - (offset + len(blogs))

    return jsonify({
        "results": [{
            "pid": b.pid,
            "author": b.author,
            "title": b.title,
            "category": b.category,
            "desc": b.desc,
            "created": b.posted_on,
            "likes": b.likes,
            "views": b.views,
        } for b in blogs],
        "has_more": remaining > 0
    }), 200

# Static File Serving (keep as is)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# Error Handler (keep as is)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    with app.context():
        db.create_all()
    app.run(debug=True)
