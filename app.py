from flask import Flask, jsonify, request
from flask import render_template, Blueprint

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# from flask_cors import cross_origin

# from models import *
from models import db
from models import Student,Log
# from models.student import Student
# from models.log import Log

from utils import timeUtils
import config

# /////////////////////////////////////////////////////////////////////////
blue = Blueprint('user',__name__)

# app = Flask(__name__)
app = Flask(__name__, static_url_path='')
app.config.from_object(config)

# 数据库初始化
db.init_app(app)

# /////////////////////////////////////////////////////////////////////////


# 路由开始
# /////////////////////////////////////////////////////////////////////////

# 注册信息页面视图
@app.route("/reg")
def reg_ui():
    return render_template("reg.html")

@app.route("/register", methods=['POST'])
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

# 根据id值获取今日的假条
@app.route('/today')
def note_today():  # put application's code here
    id = request.args['id']
    print(id)
    stu = Student.query.get(id)
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到'})
    data = {'date':getDate(),'time': str(getDate(-1))+' '+getTime()}
    return render_template("index.html",stu=stu,data=data)

# 根据id值获取明日的假条
@app.route('/tomorrow')
def note_tomorrow():
    stu = Student.query.get(request.args['id'])
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    data = {'date':getDate(1),'time':getDate()+' '+getTime()}
    return render_template("index.html",stu=stu,data=data)

# TODO 自定义多日假条生成
# 根据id值获取自定义时长的假条
@app.route('/custom')
def note_custom():
    stu = Student.query.get(request.args['id'])
    sTime = int(request.args['s'])
    eTime = int(request.args['e'])
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    data = {'date':getDate(sTime),'time':getDate(sTime-1)+' '+getTime()}
    return render_template("index.html",stu=stu,data=data)


# /////////////////////////////////////////////////////////////////////////
# 路由结束

if __name__ == '__main__':
    CORS(app)                                   #放行跨域请求
    app.run(host='0.0.0.0',port='5000',debug=True)
    # app.run(host='::', port='5000', debug=True)


