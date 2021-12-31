# gunicorn -w 2 -b 127.0.0.1:8000 app:app
nohup gunicorn -w 2 -b 0.0.0.0:8000 app:app > htu-note.log 2>&1 &
