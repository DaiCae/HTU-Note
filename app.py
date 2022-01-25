from flask import Flask
from flask_cors import CORS


import models
import services

import config


def create_app():
    app = Flask(__name__, static_url_path='')
    app.config.from_object(config)
    CORS(app)                           #放行跨域请求
    models.init_app(app)
    services.init_app(app)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8000)
    # app.run(host='::', port=8000, debug=True)


