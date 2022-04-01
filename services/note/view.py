from flask import jsonify, render_template, Blueprint, request

from models import db
from models import Student,Log
from .service import *

bp_note = Blueprint('bp_note',__name__)


# 根据id值获取今日的假条
@bp_note.route('/today')
def note_today():  # put application's code here
    id = request.args['id']
    stu = Student.query.get(id)
    saveLog(id,request.url)
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    else:
        data = getRandomDatetimeData(0)
        return render_template("index.html",stu=stu,data=data)

# 根据id值获取明日的假条
@bp_note.route('/tomorrow')
def note_tomorrow():
    stu = Student.query.get(request.args['id'])
    saveLog(id,request.url)
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    else:
        data = getRandomDatetimeData(1)
        return render_template("index.html",stu=stu,data=data)

# TODO: 随机生成请假信息和时间
@bp_note.route('/home')
def note_home():  # put application's code here
    id = request.args['id']
    stu = Student.query.get(id)
    saveLog(id,request.url)
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    else:
        data = getRandomDatetimeData(0)
        msgs = ['牙齿炎症','去医院看病','复查拿药']
        return render_template("home.html",stu=stu,data=data,msgs=msgs)

# 测试接口
@bp_note.route('/test')
def note_test():  # put application's code here
    id = request.args['id']
    stu = Student.query.get(id)
    saveLog(id,request.url)
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    else:
        data = getRandomDatetimeData(0)
        return render_template("index2.html",stu=stu,data=data)

def saveLog(uid,url):
    log = Log()
    log.uid = uid
    log.url = url
    log.time = getNowDatetime()
    db.session.add(log)
    db.session.commit()