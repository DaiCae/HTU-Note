from flask import jsonify, render_template, Blueprint, request

from models import db
from models import Student,Log
from .service import *

bp_note = Blueprint('bp_note',__name__)


MSG400 = jsonify({'code':400,'msg':'信息未找到!'})

# 根据id值获取今日的假条
@bp_note.route('/today')
def note_today():  # put application's code here
    id = request.args['id']
    stu = Student.query.get(id)
    saveLog(id,request.url)
    if stu==None:
        return MSG400
    else:
        data = getRandomDatetimeData(0)
        return render_template("index.html",stu=stu,data=data)

# 根据id值获取明日的假条
@bp_note.route('/tomorrow')
def note_tomorrow():
    stu = Student.query.get(request.args['id'])
    saveLog(id,request.url)
    if stu==None:
        return MSG400
    else:
        data = getRandomDatetimeData(1)
        return render_template("index.html",stu=stu,data=data)

# TODO 自定义多日假条生成
# 根据id值获取自定义时长的假条
@bp_note.route('/custom')
def note_custom():
    stu = Student.query.get(request.args['id'])
    # sTime = int(request.args['s'])
    # eTime = int(request.args['e'])
    saveLog(id,request.url)
    if stu==None:
        return MSG400
    else:
        data = getRandomDatetimeData(0)
        return render_template("index.html",stu=stu,data=data)


def saveLog(uid,url):
    log = Log()
    log.uid = uid
    log.url = url
    log.time = getNowDatetime()
    db.session.add(log)
    db.session.commit()