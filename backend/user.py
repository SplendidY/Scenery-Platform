from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # 允许所有域名访问
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class SearchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    search_text = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)

class FavoriteAttractions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    attraction_name = db.Column(db.String(255), nullable=False)
    added_date = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    
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

@app.route('/add_search_history', methods=['POST'])
def add_search_history():
    data = request.get_json()
    user_id = data['user_id']  # 实际项目中应该从认证信息中获取
    search_text = data['search_text']
    search_history = SearchHistory(user_id=user_id, search_text=search_text)
    db.session.add(search_history)
    db.session.commit()
    return jsonify({'message': 'Search history added successfully'}), 201

@app.route('/add_favorite_attraction', methods=['POST'])
def add_favorite_attraction():
    data = request.get_json()
    user_id = data['user_id']  # 实际项目中应该从认证信息中获取
    attraction_name = data['attraction_name']
    favorite_attraction = FavoriteAttractions(user_id=user_id, attraction_name=attraction_name)
    db.session.add(favorite_attraction)
    db.session.commit()
    return jsonify({'message': 'Attraction added to favorites successfully'}), 201

if __name__ == '__main__':
    setup_database()
    app.run(debug=True, port=5001)
