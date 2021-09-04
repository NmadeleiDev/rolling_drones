FROM python:3.9.7-slim

RUN apt update && apt install -y uvicorn && pip install psycopg2-binary sqlalchemy fastapi[all] pandas
RUN mkdir -p /app/

COPY . /app
WORKDIR /app

CMD uvicorn main:app --reload --port 2222
