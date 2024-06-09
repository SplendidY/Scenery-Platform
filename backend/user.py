from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # 允许所有域名访问
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
json_file_path = '../frontend/src/resources/data2.json'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
        return jsonify({'message': 'Logged in successfully','username': data['username'],'password': data['password']}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/update-location', methods=['POST'])
def update_location():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # 检查路径是否存在，不存在则创建
        import os
        os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
        
        with open(json_file_path, 'w', encoding='gb2312') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
        
        return jsonify({'message': 'Updated successfully'})
    except Exception as e:
        # 打印详细的错误信息以便调试
        print(f'Error updating location: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    setup_database()
    app.run(debug=True, port=5001)