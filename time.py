import datetime


def getDate(day=0):
    date = datetime.datetime.now() + datetime.timedelta(days=day)
    date = date.strftime("%Y-%m-%d")
    print(date)
    return date
    

getDate()