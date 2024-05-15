from flask import Flask
from markupsafe import escape

app = Flask(__name__)
@app.route('/user/<name>')
def user_page(name):
    return f'User: {escape(name)}'

@app.route('/')
def hello():  # put application's code here
    return '<h1>Hello Totoro!</h1><img src="http://helloflask.com/totoro.gif">'


if __name__ == '__main__':
    app.run()
