from flask import Flask, jsonify, request
from flask import render_template

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# from flask_cors import cross_origin
# from sqlalchemy.databases import mysql  # 定义MySQL特有的字段类型


import datetime
import random

# app = Flask(__name__)
app = Flask(__name__, static_url_path='')
# 数据库配置开始
# /////////////////////////////////////////////////////////////////////////


# 连接数据库
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///note.db'
app.config['SQLALCHEMY_DATABASE_URI'] ='mysql+pymysql://root:***REMOVED***@sql.***REMOVED***:24748/HTU'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

# 实例化orm框架的操作对象，后续数据库操作，都要基于操作对象来完成
db = SQLAlchemy(app)

# 学生
class Student(db.Model):
    __tablename__ = 'note_student'
    id      = db.Column(db.Integer, primary_key=True)
    name    = db.Column(db.String(20))
    sex     = db.Column(db.String(20))
    depart  = db.Column(db.String(100))
    teacher = db.Column(db.String(20))
    pic     = db.Column(db.Text(4294967295)	)
    
    def __init__(self, data):
        self.id      = data['id']
        self.name    = data['name']
        self.sex     = data['sex']
        self.depart  = data['depart']
        self.teacher = data['teacher']
        self.pic     = data['pic']

    def __repr__(self):
        return f"{self.id} {self.name}"

# 日志
class Log(db.Model):
    __tablename__ = 'note_log'
    id  = db.Column(db.Integer, primary_key = True)
    uid = db.Column(db.Integer)
    url = db.Column(db.String(200))

    def __init__(self, data):
        self.id  = data['id']
        self.uid = data['uid']
        self.url = data['url']


db.create_all()
# 数据库配置结束
# /////////////////////////////////////////////////////////////////////////


# 获取相相对于今日偏移后的日期
def getDate(day=0):
    date = datetime.datetime.now() + datetime.timedelta(days=day)
    date = date.strftime("%Y-%m-%d")
    print(date)
    return date

# 获取08点-22点之间的随机时间
def getTime():
    hour    = random.randint(8,22)
    minute  = random.randint(0,59)
    
    hour    = ('{:0>2d}'.format(hour))
    minute  = ('{:0>2d}'.format(minute))
    # print(hour+':'+minute)
    return(hour+':'+minute)

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


