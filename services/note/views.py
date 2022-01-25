from flask import Flask, jsonify, request
from flask import render_template, Blueprint
from app import Student

note = Blueprint('note',__name__)


@note.route('/today')


# 根据id值获取今日的假条
@note.route('/today')
def note_today():  # put application's code here
    id = request.args['id']
    print(id)
    stu = Student.query.get(id)
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到'})
    data = {'date':getDate(),'time': str(getDate(-1))+' '+getTime()}
    return render_template("index.html",stu=stu,data=data)

# 根据id值获取明日的假条
@note.route('/tomorrow')
def note_tomorrow():
    stu = Student.query.get(request.args['id'])
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    data = {'date':getDate(1),'time':getDate()+' '+getTime()}
    return render_template("index.html",stu=stu,data=data)

# TODO 自定义多日假条生成
# 根据id值获取自定义时长的假条
@note.route('/custom')
def note_custom():
    stu = Student.query.get(request.args['id'])
    sTime = int(request.args['s'])
    eTime = int(request.args['e'])
    if stu==None:
        return jsonify({'code':400,'msg':'信息未找到!'})
    data = {'date':getDate(sTime),'time':getDate(sTime-1)+' '+getTime()}
    return render_template("index.html",stu=stu,data=data)
