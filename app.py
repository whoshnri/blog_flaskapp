from models import User, Blog,Comments, app, db, hash_password, verify_password, cache, InteractionTracker
from sqlalchemy import func
from flask import jsonify, request,send_from_directory
from tools import timestamp, time_difference, generate_opaque_id,add_to_sheet,add_to_sheet_one
from datetime import datetime
from models import create_access_token, get_jwt_identity, jwt_required, TokenBlocklist, get_jwt
from slugify import slugify
import os
from flask_migrate import Migrate
from flask import redirect
import re
from flask import Response


migrate = Migrate(app, db)
PRERENDER_TOKEN = "gZw9IBA49cHU62VWwxDJ"

BOT_USER_AGENTS = re.compile(
    r"googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|xbot|x-bot|rogerbot|linkedinbot|linkedin|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|telegrambot|discordbot|facebot",
    re.IGNORECASE
)

@app.before_request
def prerender_if_bot():
    user_agent = request.headers.get("User-Agent", "")
    is_bot = BOT_USER_AGENTS.search(user_agent)
    is_html = "text/html" in request.headers.get("Accept", "")

    # Skip API, static files, and assets
    if request.path.startswith("/api") or request.path.startswith("/static") or "." in request.path:
        return

    if is_bot and is_html and request.method == "GET":
        prerender_url = f"https://service.prerender.io{request.url}"
        try:
            prerender_response = requests.get(
                prerender_url,
                headers={"X-Prerender-Token": PRERENDER_TOKEN},
                timeout=5
            )
            return Response(prerender_response.content, status=prerender_response.status_code, content_type=prerender_response.headers.get("Content-Type", "text/html"))
        except Exception as e:
            print("Prerender fetch failed:", str(e))
            return None  # fallback to normal route


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
    print(data["i"])  # Debug print — consider removing for production

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
    ip = request.remote_addr
    if InteractionTracker.query.filter_by(blog_pid=id, ip_address=ip, interaction_type='like').first():
        return jsonify({"message": "Already liked", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    blog.likes += 1
    db.session.add(InteractionTracker(blog_pid=id, ip_address=ip, interaction_type='like'))
    db.session.commit()
    return jsonify({"message": "Like added", "likes": blog.likes, "status": 200}), 200

# Add a view to a blog post
def get_real_ip():
    forwarded_for = request.headers.get('X-Forwarded-For', '')
    if forwarded_for:
        # Split multiple proxies and take the first IP (the client)
        return forwarded_for.split(',')[0].strip()
    return request.remote_addr

@app.route("/add/views/<string:id>", methods=['PATCH'])
def add_views(id):
    ip = get_real_ip()
    today = timestamp()  # Should return something like "2025-06-18"

    # Check if this IP already viewed the blog today
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

    res = add_to_sheet(email, feedback, rating)
    if res == 200:
        return jsonify({"message": "Feedback received", "status": 200}), 200
    else:
        return jsonify({"message": "Unexpected error", "status": 500}), 522


@app.route("/newsletter", methods=["POST"])
def newsletter():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"message": "Missing fields", "status": 400}), 400
    res = add_to_sheet_one(email)
    if res == 200:
        return jsonify({"message": "email received", "status": 200}), 200
    else:
        return jsonify({"message": "Error saving email",  "status": 500}), 500



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
