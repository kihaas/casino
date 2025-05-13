from flask import Blueprint, request, jsonify, redirect, url_for, render_template
from werkzeug.security import generate_password_hash
from backend.scr.models.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)


# Убираем @jwt_required(), чтобы можно было зайти на страницу
@auth_bp.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@auth_bp.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


@auth_bp.route('/logout')
@jwt_required()
def logout():
    response = redirect(url_for('auth.login'))
    response.delete_cookie('access_token_cookie')
    return response


# API для логина
# @auth_bp.route('/api/auth/login', methods=['POST'])
# def api_login():
#     email = request.json.get('email')
#     password = request.json.get('password')
#
#     user = User.query.filter_by(email=email).first()
#
#     if user and user.check_password(password):
#         access_token = create_access_token(identity=user.id)
#         return jsonify(access_token=access_token), 200
#
#     return jsonify({"error": "Invalid credentials"}), 401
#
#
# # API для регистрации
# @auth_bp.route('/api/auth/register', methods=['POST'])
# def api_register():
#     username = request.json.get('username')
#     email = request.json.get('email')
#     password = request.json.get('password')
#
#     if User.query.filter_by(username=username).first():
#         return jsonify({"error": "Username already exists"}), 400
#
#     if User.query.filter_by(email=email).first():
#         return jsonify({"error": "Email already exists"}), 400
#
#     hashed_pw = generate_password_hash(password)
#
#     new_user = User(
#         username=username,
#         email=email,
#         password_hash=hashed_pw
#     )
#
#     db.session.add(new_user)
#     db.session.commit()
#
#     # return jsonify({"message": "User created successfully"}), 201