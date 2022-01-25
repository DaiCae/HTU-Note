import datetime
import random

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
