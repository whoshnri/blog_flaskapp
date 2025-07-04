from models import User, Blog,Comments, app, db, hash_password, verify_password, cache, InteractionTracker
from sqlalchemy import func
from flask import jsonify, request,send_from_directory
from tools import timestamp, time_difference, generate_opaque_id
from datetime import datetime
from models import create_access_token, get_jwt_identity, jwt_required, TokenBlocklist, get_jwt
from slugify import slugify
import os
from flask_migrate import Migrate
from flask import redirect
import re
import requests
from urllib.parse import urlparse, urljoin, quote
from flask import Response

GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby1ToxE9ooC10WA7kjW7YxJWebZhDDZE7rhw_AYq--Z8FeUQOP-nafUBEaPgr1UuAcf5A/exec"
GOOGLE_SCRIPT_URL2 = "https://script.google.com/macros/s/AKfycbwH79pohvQi8g9agkB4wgQ1VEwXjZYCHjSwN9koG64o2s8qvZe5qfRzeRLPlT8GPBsR/exec"
migrate = Migrate(app, db)
PRERENDER_SERVICE = "https://service.prerender.io/"
PRERENDER_TOKEN = "gZw9IBA49cHU62VWwxDJ"  # Move to environment variables in production

# Pre-compiled regex for bot detection
BOT_USER_AGENTS = re.compile(
    r"(googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|"
    r"xbot|x-bot|rogerbot|linkedinbot|linkedin|embedly|quora link preview|"
    r"showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|"
    r"redditbot|applebot|whatsapp|telegrambot|discordbot|facebot|prerender)",
    re.IGNORECASE
)

SKIP_EXACT_PATHS = {
    '/robots.txt',
    '/sitemap.xml',
    '/favicon.ico',
    '/health'
}

SKIP_PREFIX_PATHS = {
    '/api/',
    '/static/',
    '/_next/',
    '/assets/',
    '/admin/',
    '/wp-admin/'
}

SKIP_EXTENSIONS = {
    '.js', '.css', '.xml', '.less', '.png', '.jpg', '.jpeg', '.gif',
    '.pdf', '.doc', '.txt', '.ico', '.rss', '.zip', '.mp3', '.rar',
    '.exe', '.wmv', '.avi', '.ppt', '.mpg', '.mpeg', '.tif', '.wav',
    '.mov', '.psd', '.ai', '.xls', '.mp4', '.m4a', '.swf', '.dat',
    '.dmg', '.iso', '.flv', '.m4v', '.torrent', '.woff', '.ttf',
    '.svg', '.webp', '.json'
}

@app.before_request
def prerender_if_bot():
    if request.method != "GET":
        return

    path = request.path
    user_agent = request.headers.get("User-Agent", "")
    accept = request.headers.get("Accept", "")

    # Skip conditions
    if (path in SKIP_EXACT_PATHS or
        any(path.startswith(prefix) for prefix in SKIP_PREFIX_PATHS) or
        any(path.endswith(ext) for ext in SKIP_EXTENSIONS)):
        return

    # Check if bot and wants HTML
    is_bot = BOT_USER_AGENTS.search(user_agent) is not None
    is_html = "text/html" in accept or "*/*" in accept or not accept



    if is_bot and is_html:
        # Force HTTPS and proper URL encoding
        target_url = request.url.replace('http://', 'https://')
        prerender_url = f"{PRERENDER_SERVICE.rstrip('/')}/{quote(target_url, safe=':/?&=')}"

        print(f"🚀 Sending to Prerender: {prerender_url}")

        try:
            response = requests.get(
                prerender_url,
                headers={
                    "X-Prerender-Token": PRERENDER_TOKEN,
                    "User-Agent": user_agent,
                    "X-Prerender-Wait-For-Render": "30000",  # 30 second timeout
                    "X-Prerender-Debug": "true"  # Get debug info
                },
                timeout=35  # Slightly longer than Prerender's timeout
            )

            if response.status_code == 200:
                # Verify it's actually prerendered
                if 'text/html' in response.headers.get('Content-Type', ''):
                    return Response(
                        response.content,
                        status=200,
                        headers={
                            'Content-Type': 'text/html',
                            'Cache-Control': 'public, max-age=300'
                        }
                    )
                else:
                    print("⚠️ Prerender returned non-HTML content")

        except requests.Timeout:
            print("⌛ Prerender timeout - falling back to SPA")
        except Exception as e:
            print(f"⚠️ Prerender error: {str(e)}")

    return None
def generate_description(content):
    words = content.strip().split()
    return " ".join(words[:50]) + "..." if len(words) > 50 else " ".join(words[:-1]) + "..."

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)

    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, "index.html")

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

# Get all registered users
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "username": u.username,
            "email": u.email,
            "displayPhoto": str(u.pfp),
            "uuid" : u.uuid,
            "post_count" : (len(u.posts)),
            "view_count" : sum(post.views for post in u.posts),
            "like_count": sum(post.likes for post in u.posts),
            "post_count": len(u.posts)
        } for u in users
    ])

# Register new user
@app.route("/new/user", methods=["POST"])
def create_user():
    data = request.get_json()
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"message": "missing fields"}), 400

    while True:
        unique_id = generate_opaque_id()
        existing_user = User.query.filter_by(uuid=unique_id).first()
        if not existing_user:
            break


    new_user = User(
        username=data["username"],
        email=data["email"],
        password=hash_password(data["password"]),  # Hashed password
        uuid=unique_id
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# Login existing user
@app.route("/get/user", methods=['POST'])
def log_user():
    data = request.get_json()
    try:
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "Invalid Email", "status": 401}), 401

        if verify_password(data["password"], user.password):
            access_token = create_access_token(identity=user.uuid)
            return jsonify({"message": "Login Successful", "token": access_token, "username":user.username, "uuid": user.uuid }), 200
        else:
            return jsonify({"message": "Password Invalid", "status": 402}), 401
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Logout a user by revoking the token
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    try:
        jti = get_jwt()["jti"]  # Get unique token ID
        db.session.add(TokenBlocklist(jti=jti))  # Add to blocklist
        db.session.commit()
        return jsonify({"message": "Successfully logged out", "status": 200}), 200
    except Exception as e:
        return jsonify({"message": "Logout failed", "error": str(e), "status": 500}), 500



#dashboard rendering
@app.route("/verify/uuid/<uuid>", methods=["GET"])
@jwt_required()
def verify_uuid(uuid):
    user = User.query.filter_by(uuid=uuid).first()
    if not user:
        return jsonify({"msg": "Invalid UUID"}), 404
    return jsonify({"username": user.username, uuid: user.uuid}), 200



@app.route("/user/<string:username>", methods=["GET"])
def user(username):
    u = User.query.filter_by(username=username).first()
    if u:
        posts = u.posts
        return jsonify({"message": "successful", "status": 201, "data":{
            "username": u.username,
            "email": u.email,
            "displayPhoto": str(u.pfp),
            "uuid" : u.uuid,
            "post_count" : (len(u.posts)),
            "view_count" : sum(post.views for post in u.posts),
            "like_count": sum(post.likes for post in u.posts)

        }}), 201


# Check if username or email is already taken
@app.route("/check", methods=['POST'])
def check_user():
    data = request.get_json()
    print(data["i"])

    if data['i'] == "email":
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "Valid Email", "status": 200}), 200
        else:
            return jsonify({"message": "Email already taken", "status": 409}), 409
    else:
        user = User.query.filter_by(username=data['username']).first()
        if not user:
            return jsonify({"message": "Valid Username", "status": 200}), 200
        else:
            return jsonify({"message": "Username already taken", "status": 409}), 409

# ────────────────────────────────
# BLOGS
# ────────────────────────────────

@app.route("/get/blogs", methods=["GET"])
def get_blogs():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 4))

    query = Blog.query.order_by(Blog.posted_on.desc())
    total = query.count()
    offset = (page - 1) * limit

    blogs = query.offset(offset).limit(limit).all()

    # remaining items after this batch
    remaining = total - (offset + len(blogs))

    return jsonify({
        "results": [
            {
                "pid": b.pid,
                "author": b.author,
                "title": b.title,
                "category": b.category,
                "desc": b.desc,
                "created": b.posted_on,
                "likes": b.likes,
                "views": b.views,
            }
            for b in blogs
        ],
        "has_more": remaining > 0
    }), 200

#get recent blogs
@app.route("/get/blogs/recent", methods=['GET'])
def get_blogs_recent():
    blogs = Blog.query.order_by(Blog.created_at.desc()).limit(6).all()
    if blogs:
        return jsonify([
            {
                "pid": b.pid,
                "author": b.author,
                "title": b.title,
                "category": b.category,
                "desc": b.desc,
                "created": b.posted_on,
                "likes": b.likes,
                "views": b.views
            } for b in blogs
        ]), 200
    return jsonify({"message": "No posts found"}), 404

# Get a single blog by ID
@app.route("/get/blog/<string:id>", methods=['GET'])
def get_blog(id):
    blog = Blog.query.filter_by(pid=id).first()
    if blog:
        return jsonify({
            "pid": blog.pid,
            "author": blog.author,
            "title": blog.title,
            "category": blog.category,
            "desc": blog.desc,
            "created": blog.posted_on,
            "likes": blog.likes,
            "views": blog.views,
            "content": blog.content,
        }), 201
    return jsonify({"message": "Blog not found"}), 404

# Get blogs by author username
@app.route("/get/blog/username/<string:username>", methods=['GET'])
def get_blogs_by_username(username):
    blogs = Blog.query.filter_by(author=username).all()
    if blogs:
        return jsonify([
            {
                "pid": blog.pid,
                "author": blog.author,
                "title": blog.title,
                "category": blog.category,
                "desc": blog.desc,
                "created": blog.posted_on,
                "likes": blog.likes,
                "views": blog.views,
            } for blog in blogs
        ]), 201
    return jsonify({"message": "You have no new blogs sorry"}), 404


@app.route("/new/blog", methods=['POST'])
@jwt_required()
def add_blog():
    uuid = get_jwt_identity()
    data = request.get_json()

    user = User.query.filter_by(uuid=uuid).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        new_blog = Blog(
            author=user.username,  # Get author from DB, not from client
            category=data["category"],
            content=data["content"],
            title=data["title"],
            posted_on=timestamp(),
            desc=generate_description(data["content"])
        )
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({"message": "Post added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


#updating blogs
@app.route("/update/<string:id>", methods=['PATCH'])
@jwt_required()
def patch_blog(id):
    data = request.get_json()
    token_uuid = get_jwt_identity()

    author = data.get("username", "")
    title = data.get("title", "")
    content = data.get("content", "")
    category = data.get("category", "")

    # Step 1: Confirm that this author has a blog with that ID
    blog = Blog.query.filter_by(pid=id, author=author).first()
    if not blog:
        return jsonify({"message": "Blog not found for this author", "status": 404}), 404

    # Step 2: Get the UUID of the author from the User table
    user = User.query.filter_by(username=author).first()
    if not user:
        return jsonify({"message": "Author not found in User table", "status": 404}), 404

    # Step 3: Confirm the UUID matches the token UUID
    if user.uuid != token_uuid:
        return jsonify({"message": "Unauthorized: UUID mismatch", "status": 403}), 403

    # Step 4: Apply updates
    try:
        if content:
            blog.content = content
            blog.desc= generate_description(content)

        if title:
            blog.title = title
        if category:
            blog.category = category


        db.session.commit()
        return jsonify({"message": "Post Updated", "status": 200}), 200

    except Exception as e:
        return jsonify({
            "message": str(e),
            "status": 500
        }), 500


#getting to comments
@app.route("/comments/<string:pid>", methods=['GET'])
def get_comments(pid):
    comments = Comments.query.filter_by(blog_pid=pid).all()
    return jsonify({
        "status": 200,
        "comments": [{
            "comment": c.comment,
            "name": c.name,
            "timestamp": c.timestamp
        } for c in comments]
    }), 200


@app.route("/add/comment/<string:pid>", methods=["POST"])
def add_comment(pid):
    data = request.get_json()
    try:
        db.session.add(Comments(blog_pid=pid, comment=data["comment"],name=data["name"], timestamp=timestamp()))
        db.session.commit()
        return jsonify({"message" : "Comment added!"}), 201
    except Exception as e:
        return jsonify({"message" : f"An error {str(e)} occured"}), 500




# ────────────────────────────────
# INTERACTIONS: Likes, Views
# ────────────────────────────────

# Add a like to a blog post
@app.route("/add/likes/<string:id>", methods=['PATCH'])
def add_likes(id):
    ip = get_real_ip()
    if InteractionTracker.query.filter_by(blog_pid=id, ip_address=ip, interaction_type='like').first():
        return jsonify({"message": "Already liked", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    blog.likes += 1
    db.session.add(InteractionTracker(blog_pid=id, ip_address=ip, interaction_type='like'))
    db.session.commit()
    return jsonify({"message": "Like added", "likes": blog.likes, "status": 200}), 200

def get_real_ip():
    forwarded_for = request.headers.get('X-Forwarded-For', '')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    return request.remote_addr

@app.route("/add/views/<string:id>", methods=['PATCH'])
def add_views(id):
    ip = get_real_ip()
    today = timestamp()


    already_viewed = InteractionTracker.query.filter_by(
        blog_pid=id,
        ip_address=ip,
        interaction_type='view',
        day=today
    ).first()

    if already_viewed:
        return jsonify({"message": "Already viewed today", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    blog.views += 1

    # Record new view interaction
    new_interaction = InteractionTracker(
        blog_pid=id,
        ip_address=ip,
        interaction_type='view'  # Store the current day to prevent duplicates
    )
    db.session.add(new_interaction)
    db.session.commit()

    return jsonify({"message": "View added", "views": blog.views, "status": 200}), 200

# Remove a like from a blog post
@app.route("/remove/likes/<string:id>", methods=['PATCH'])
def remove_likes(id):
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    interaction = InteractionTracker.query.filter_by(
        blog_pid=id, ip_address=ip, interaction_type='like'
    ).first()

    if not interaction:
        return jsonify({"message": "You haven't liked this post", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    if blog.likes > 0:
        blog.likes -= 1

    db.session.delete(interaction)
    db.session.commit()
    return jsonify({"message": "Like removed", "likes": blog.likes, "status": 200}), 200


@app.route("/view/count/<string:username>/<string:datetime>", methods=["GET"])
def analytics(username, datetime):
    try:
        total = (
            db.session.query(func.count(InteractionTracker.id))
            .join(Blog, Blog.pid == InteractionTracker.blog_pid)
            .filter(
                Blog.author == username,
                InteractionTracker.day == datetime,
                InteractionTracker.interaction_type == "view"
            )
            .scalar()
        )

        return jsonify({"total": int(total)}), 200

    except Exception as e:
        return jsonify({"Error": str(e), "total": int(0)}), 500

@app.route("/send/feedback", methods=["POST"])
def send_feedback():
    data = request.get_json()

    email = data.get("email")
    feedback = data.get("feedback")
    rating = data.get("rating")

    if not email or not feedback or rating is None:
        return jsonify({"message": "Missing fields", "status": 400}), 400

    try:
        response = requests.post(GOOGLE_SCRIPT_URL2, json={
            "email": email,
            "feedback" : feedback,
            "rating" : rating
            })
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/newsletter", methods=["POST"])
def newsletter():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"message": "Missing email field", "status": 400}), 400

    try:
        response = requests.post(GOOGLE_SCRIPT_URL, json={"email": email})
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/debug/interactions", methods=["GET"])
def print_interactions():
    interactions = InteractionTracker.query.all()
    return jsonify([
        {
            "id": i.id,
            "blog_pid": i.blog_pid,
            "ip_address": i.ip_address,
            "interaction_type": i.interaction_type,
            "day": str(i.day) if hasattr(i, "day") else "N/A",
        } for i in interactions
    ]), 200

@app.route('/init-db', methods=['POST'])
def init_db():
    try:
        db.create_all()
        return jsonify({"message": "All tables created successfully."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ────────────────────────────────
# ENTRY POINT
# ────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True)
