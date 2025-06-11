from models import User, Blog, app, db, hash_password, verify_password, cache, InteractionTracker
from flask import jsonify, request, Flask
from datetime import datetime, timezone

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([
        {"userName": u.username, "email": u.email, "displayPhoto": str(u.pfp)}  
        for u in users
    ])


@app.route("/add/user", methods=["POST"])
def create_user():
    data = request.get_json()
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"message":"missing fields"}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        password=hash_password(data["password"])
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@app.route("/get/user", methods=['POST'])
def log_user():
    data = request.get_json()
    try:
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "Invalid Email" , "status": 401}), 401
        
        if verify_password(data["password"],user.password):
        	return jsonify({"message": "Login Successful"}), 200
        else:
            return jsonify({"message": "Password Invalid", "status": 402}), 401
     
    except Exception as e:
        return jsonify({"message": str(e)}), 500


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


@app.route("/get/blogs", methods=['GET'])
def get_blogs():
    blogs = Blog.query.all()
    if blogs:
        return jsonify([{"pid": b.pid, "author": b.author, "title": b.title, "category": b.category, 
                        "desc": b.desc, "created_at": b.timestamp} for b in blogs]), 200
    return jsonify({"message": "No posts found"}), 404


@app.route("/get/blog/<int:id>", methods=['GET'])
def get_blog(id):
    blog = Blog.query.filter_by(pid=id).first()
    if blog:
        return jsonify({"pid": blog.pid, "author": blog.author, "content":blog.content,"title":blog.title,
                       "category": blog.category, "desc": blog.desc, "views":blog.views, "likes": blog.likes, "date":blog.timestamp})
    return jsonify({"message": "Blog not found"}), 404


@app.route("/add/blog", methods=['POST'])
def add_blog():
    data = request.get_json()
    try:
        new_blog = Blog(
            author=data["author"],
            category=data["category"],
            content=data["content"],
            title=data["title"],
            timestamp=datetime.now(timezone.utc)
        )
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({"message": "Post added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@app.route("/add/likes/<int:id>", methods=['PATCH'])
def add_likes(id):
    ip = request.remote_addr
    if InteractionTracker.query.filter_by(blog_id=id, ip_address=ip, interaction_type='like').first():
        return jsonify({"message": "Already liked", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    blog.likes += 1
    db.session.add(InteractionTracker(blog_id=id, ip_address=ip, interaction_type='like'))
    db.session.commit()
    return jsonify({"message": "Like added", "likes": blog.likes, "status": 200}), 200

@app.route("/add/views/<int:id>", methods=['PATCH'])
def add_views(id):
    ip = request.remote_addr
    if InteractionTracker.query.filter_by(blog_id=id, ip_address=ip, interaction_type='view').first():
        return jsonify({"message": "Already viewed", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    blog.views += 1
    db.session.add(InteractionTracker(blog_id=id, ip_address=ip, interaction_type='view'))
    db.session.commit()
    return jsonify({"message": "View added", "views": blog.views, "status": 200}), 200

@app.route("/remove/likes/<int:id>", methods=['PATCH'])
def remove_likes(id):
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    interaction = InteractionTracker.query.filter_by(
        blog_id=id, ip_address=ip, interaction_type='like'
    ).first()

    if not interaction:
        return jsonify({"message": "You haven't liked this post", "status": 403}), 403

    blog = Blog.query.filter_by(pid=id).first()
    if not blog:
        return jsonify({"message": "Blog not found", "status": 404}), 404

    # Avoid negative like count
    if blog.likes > 0:
        blog.likes -= 1

    db.session.delete(interaction)
    db.session.commit()

    return jsonify({"message": "Like removed", "likes": blog.likes, "status": 200}), 200



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)