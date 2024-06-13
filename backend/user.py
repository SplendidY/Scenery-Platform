from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import os

import json
import heapq

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
json_file_path = '../frontend/src/resources/data2.json'

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

# 建立数据库    
def setup_database():
    with app.app_context():
        db.create_all()

# API接口
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

# 景点推荐功能
# 函数：计算曼哈顿距离
def manhattan_distance(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)

# 函数：找到与制定景点曼哈顿距离最小的三个景点
def find_closest_spots(name, json_file_path):
    # 使用 GB2312 编码打开 JSON 文件
    with open(json_file_path, 'r', encoding='gb2312') as file:
        data = json.load(file)  # 加载JSON数据

    # 寻找符合搜索名称的景点
    target_spot = None
    for spot in data:
        if spot['NAME'] == name:
            target_spot = spot
            break

    if not target_spot:
        return None, "指定的景点名称不存在"

    target_lon = target_spot['LON']
    target_lat = target_spot['LAT']

    distances = []
    for spot in data:
        if spot['NAME'] != name:
            lon = spot['LON']
            lat = spot['LAT']
            distance = manhattan_distance(target_lon, target_lat, lon, lat)
            distances.append((distance, spot['NAME']))

    # 使用最大堆来存储最近的三个景点
    max_heap = []
    for spot in data:
        if spot['NAME'] != name:
            lon = spot['LON']
            lat = spot['LAT']
            distance = manhattan_distance(target_lon, target_lat, lon, lat)
            # 维护一个大小为3的最大堆
            if len(max_heap) < 3:
                heapq.heappush(max_heap, (-distance, spot['NAME']))  # 用负距离来构造最大堆
            else:
                heapq.heappushpop(max_heap, (-distance, spot['NAME']))

    # 从最大堆中提取最近的三个景点
    closest_spots = sorted((-heap[0], heap[1]) for heap in max_heap)

    return [spot[1] for spot in closest_spots], None

@app.route('/search_closest_spots', methods=['POST'])
def search_closest_spots():
    data = request.get_json()
    spot_name = data.get('spotName') 

    if not spot_name:
        return jsonify({'error': 'No spot name provided'}), 400

    closest_names, error = find_closest_spots(spot_name, json_file_path)
    if error:
        return jsonify({'error': error}), 404
    else:
        return jsonify({'closest_spots': closest_names}), 200

@app.route('/change_password', methods=['POST'])
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


if __name__ == '__main__':
    setup_database()
    app.run(debug=True, port=5001)