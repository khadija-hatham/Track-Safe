from flask import Blueprint, request, jsonify
from models.user_model import User
from models.database import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
bcrypt = Bcrypt()

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], password=hashed_password, role=data.get('role', 'worker'))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify(access_token=token), 200
    return jsonify({"message": "Invalid credentials"}), 401
