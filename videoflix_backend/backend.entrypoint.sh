#!/bin/sh
set -e
echo "Starting my application..."

python manage.py migrate
python manage.py collectstatic --noinput

echo "Versuche Superuser zu erstellen..."
python manage.py shell <<EOF || echo "Superuser-Erstellung übersprungen (DB-Fehler)"
import os
from django.contrib.auth import get_user_model
User = get_user_model()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password)
EOF

exec gunicorn videoflix_config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers ${GUNICORN_WORKERS} \
  --threads 2 \
  --timeout 60
