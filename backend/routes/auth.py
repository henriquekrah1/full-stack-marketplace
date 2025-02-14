from flask import Blueprint, request, jsonify
from extensions import db, bcrypt, jwt  # Import db, bcrypt, and jwt from extensions
from models import User  # Import your User model
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/create-account', methods=['POST'])
def create_account():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')  # Capture username from request data
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({"message": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Missing required fields"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)

    # Include username and email in the response
    return jsonify({
        "access_token": access_token,
        "user": {
            "username": user.username,
            "email": user.email
        }
    }), 200
