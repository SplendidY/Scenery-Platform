from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
json_file_path = '../frontend/src/resources/data2.json'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    favorites = db.Column(db.String, default='[]') 

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

<<<<<<< Updated upstream
=======
# 建立数据库    
>>>>>>> Stashed changes
def setup_database():
    with app.app_context():
        db.create_all()

@app.route('/register', methods=['POST'])
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({'message': 'Logged in successfully', 'username': data['username'], 'password': data['password']}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

<<<<<<< Updated upstream
=======
@app.route('/add_favorite_attraction', methods=['POST'])
def add_favorite_attraction():
    data = request.get_json()
    user_id = data['user_id']  # 实际项目中应该从认证信息中获取
    attraction_name = data['attraction_name']
    favorite_attraction = FavoriteAttractions(user_id=user_id, attraction_name=attraction_name)
    db.session.add(favorite_attraction)
    db.session.commit()
    return jsonify({'message': 'Attraction added to favorites successfully'}), 201
>>>>>>> Stashed changes
@app.route('/update-location', methods=['POST'])
def update_location():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        import os
        os.makedirs(os.path.dirname(json_file_path), exist_ok=True)

        with open(json_file_path, 'w', encoding='gb2312') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)

        return jsonify({'message': 'Updated successfully'})
    except Exception as e:
        print(f'Error updating location: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/add_favorite', methods=['POST'])
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


@app.route('/remove_favorite', methods=['POST'])
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

@app.route('/get_favorites', methods=['GET'])
def get_favorites():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if user:
        favorites = json.loads(user.favorites)
        return jsonify({'favorites': favorites}), 200
    return jsonify({'error': 'User not found'}), 404


if __name__ == '__main__':
    setup_database()
    app.run(debug=True, port=5001)
