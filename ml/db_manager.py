from datetime import datetime
import os
import logging
import psycopg2

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.schema import CreateSchema, CreateTable

class DbPandasManager():
    datasets_schema_name = 'user_datasets'

    def __init__(self) -> None:
        self.db_name = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = os.getenv('POSTGRES_PORT')
        self.user = os.getenv('POSTGRES_USER')
        self.password = os.getenv('POSTGRES_PASSWORD')

        self.engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(self.user, self.password, self.host, self.port, self.db_name), pool_recycle=3600);

    def load_dataset(self, ds_name: str) -> pd.DataFrame:
        conn = self.engine.connect()
        try:
            res = pd.read_sql("select * from {}.{}".format(self.datasets_schema_name, ds_name), conn)
        except Exception as e:
            logging.error("Failed to write df: {}".format(e))
            res = None
        conn.close
        return res


class DbPlainManager():
    models_info_schema = "models_info"
    models_info_table = "model"

    def __init__(self) -> None:
        self.db_name = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = os.getenv('POSTGRES_PORT')
        self.user = os.getenv('POSTGRES_USER')
        self.password = os.getenv('POSTGRES_PASSWORD')

    def init_connection(self):
        self.conn = psycopg2.connect(dbname=self.db_name, user=self.user, 
                        password=self.password, host=self.host, port=self.port)

        self.conn.autocommit = True
        self.cursor = self.conn.cursor()

    def close_conn(self):
        self.cursor.close()
        self.conn.close()
        self.conn, self.cursor = None, None

    def create_tables(self):
        self.init_connection()
        self.cursor.execute("CREATE SCHEMA IF NOT EXISTS {}".format(self.models_info_schema))
        self.cursor.execute("""CREATE TABLE IF NOT EXISTS {}.{} ( 
            	id serial
                    constraint {}_pk
                        primary key,
                name varchar unique not null,
                created_at timestamp default now(),
                weights_file_name varchar not null
        )""".format(self.models_info_schema, self.models_info_table, self.models_info_table))
        self.close_conn()

    def save_model_info(self, name: str, weights_filename: str) -> bool:
        self.init_connection()
        res = False
        try:
            self.cursor.execute("INSERT INTO {}.{} (name, weights_file_name) VALUES (%s, %s)".format(self.models_info_schema, self.models_info_table),
                                    name, weights_filename)
            res = True
        except Exception as e:
            logging.error("Failed to insert model info: {}".format(e))
        self.close_conn()
        return res

    def get_model_weights_filename(self, name: str) -> str:
        self.init_connection()
        try:
            self.cursor.execute("SELECT weights_file_name FROM {}.{} WHERE name = %s".format(self.models_info_schema, self.models_info_table),
                                    name)
            res = self.cursor.fetchone()
            if len(res) > 0:
                res = res[0]
        except Exception as e:
            logging.error("Failed to insert model info: {}".format(e))
            res = ''
        self.close_conn()        
        return res

    def get_dataset_names(self) -> list:
        self.init_connection()
        try:
            self.cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = '{}'".format(self.datasets_schema_name))
            res = self.cursor.fetchall()
            res = [x[0] for x in res]
        except Exception as e:
            logging.error("Failed to insert model info: {}".format(e))
            res = []
        self.close_conn()        
        return res


