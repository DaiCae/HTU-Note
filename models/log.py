from . import db

# 日志
class Log(db.Model):
    __tablename__ = 'note_log'
    id   = db.Column(db.Integer, primary_key = True)
    uid  = db.Column(db.Integer)
    url  = db.Column(db.String(200))
    time = db.Column(db.DateTime)

    def __init__(self, data):
        self.id  = data['id']
        self.uid = data['uid']
        self.url = data['url']
        self.time = data['time']