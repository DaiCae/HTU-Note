from . import db

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