FROM python:3.9.7-slim

RUN apt install -y uvicorn && pip install psycopg2-binary sqlalchemy fastapi[all]
RUN mkdir -p /app/

COPY . /app
WORKDIR /app

CMD uvicorn main:app --reload
