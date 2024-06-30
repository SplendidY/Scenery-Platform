from flask import Blueprint
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json

user = Blueprint('user',__name__)

db = SQLAlchemy()
jwt = JWTManager()


# 定义用户数据列表
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    favorites = db.Column(db.String, default='[]') 

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# API接口
@user.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@user.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({'message': 'Logged in successfully', 'username': data['username'], 'password': data['password']}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@user.route('/add_favorite', methods=['POST'])
def add_favorite():
    data = request.get_json()
    username = data['username']
    spotname = data['spotname']
    user = User.query.filter_by(username=username).first()
    if user:
        favorites = json.loads(user.favorites)
        if spotname not in favorites:
            favorites.append(spotname)
            user.favorites = json.dumps(favorites)
            db.session.commit()
            return jsonify({'message': 'Favorite added successfully'}), 200
        else:
            return jsonify({'message': 'Favorite already exists'}), 200
    return jsonify({'error': 'User not found'}), 404


@user.route('/remove_favorite', methods=['POST'])
def remove_favorite():
    data = request.get_json()
    username = data['username']
    spotname = data['spotname']
    user = User.query.filter_by(username=username).first()
    if user:
        favorites = json.loads(user.favorites)
        if spotname in favorites:
            favorites.remove(spotname)
            user.favorites = json.dumps(favorites)
            db.session.commit()
            return jsonify({'message': 'Favorite removed successfully'}), 200
        return jsonify({'error': 'Favorite not found'}), 404
    return jsonify({'error': 'User not found'}), 404

@user.route('/get_favorites', methods=['GET'])
def get_favorites():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if user:
        favorites = json.loads(user.favorites)
        return jsonify({'favorites': favorites}), 200
    return jsonify({'error': 'User not found'}), 404


# 修改密码功能
@user.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data.get('user_name')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_new_password = data.get('confirm_new_password')
    user = User.query.filter_by(username=username).first()
    if user:
        if not user.check_password(old_password):
            return jsonify({"error": "Old password is incorrect"}), 401
    if new_password != confirm_new_password:
        return jsonify({"error": "New passwords do not match"}), 422
    
    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200
