from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


def init_app(app):
    db.init_app(app) # 数据库初始化

from .student import Student
from .log import Log


