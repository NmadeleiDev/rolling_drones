FROM continuumio/anaconda3

RUN apt update && apt install -y uvicorn && \
    pip install psycopg2-binary sqlalchemy fastapi[all] openpyxl xlrd \
    && conda install tensorflow \
    && conda install -c conda-forge python-levenshtein
RUN mkdir -p /app/

COPY . /app
WORKDIR /app

EXPOSE 2222

CMD uvicorn main:app --reload --port 2222 --host 0.0.0.0 --log-level debug
