from flask import Flask
from blueprints.geoserver import geoserver
from blueprints.recommend import recommend
from blueprints.user import user
from blueprints.user import db
from config import Config
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

app.register_blueprint(recommend, url_prefix='/recommend')
app.register_blueprint(geoserver, url_prefix='/geoserver')
app.register_blueprint(user, url_prefix='/user')

db.init_app(app)


# 建立数据库    
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)