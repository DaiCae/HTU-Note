from flask import jsonify, render_template, Blueprint, request

from models import db
from models import Student
from .service import *

bp_reg = Blueprint('bp_reg',__name__)


# 注册信息页面视图
@bp_reg.route("/reg")
def reg_ui():
    return render_template("reg.html")

@bp_reg.route("/register", methods=['POST'])
def register():
    try:
        data = request.get_json()
        data = dict(data)
        if (len(data) < 6):
            return jsonify({'code':500,'msg':'信息数量错误!'})
        student = Student(data)
        db.session.add(student)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({'code':500,'msg':'出现错误!'})
    return jsonify({'code':200})