#!/bin/sh


python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

daphne -b 0.0.0.0 -p 8000 backend.asgi:application
