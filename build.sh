#!/usr/bin/env bash
set -o errexit

pip install -r backend/requirements.txt

python backend/chemviz/manage.py collectstatic --noinput
python backend/chemviz/manage.py migrate