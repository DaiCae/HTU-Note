# from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker


# engine = create_engine('mysql+pymysql://root:123456@127.0.0.1/test')
# Base = declarative_base()

# class Student(Base):
#     __tablename__ = 'student'
#     id      = Column(Integer, primary_key=True)
#     name    = Column(String(20))
#     sex     = Column(String(20))
#     depart  = Column(String(100))

# Base.metadata.create_all(engine) #创建表结构

# DBsession = sessionmaker(bind=engine)
# session = DBsession()

# # session.add_all([student1, student2, student3])
# session.commit()
# session.close()











import random

def getTime():
    hour    = random.randint(8,22)
    minute  = random.randint(0,59)
    
    hour    = ('{:0>2d}'.format(hour))
    minute  = ('{:0>2d}'.format(minute))

    # print(hour+':'+minute)
    return(hour+':'+minute)

getTime()