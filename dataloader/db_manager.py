from datetime import datetime
import os
import logging
import psycopg2

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.schema import CreateSchema, CreateTable

class DbManager():
    datasets_schema_name = 'user_datasets'

    def __init__(self) -> None:
        self.db_name = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = os.getenv('POSTGRES_PORT')
        self.user = os.getenv('POSTGRES_USER')
        self.password = os.getenv('POSTGRES_PASSWORD')

        self.engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(self.user, self.password, self.host, self.port, self.db_name), pool_recycle=3600);

    def create_tables(self):
        conn = self.engine.connect()
        if not conn.dialect.has_schema(conn, self.datasets_schema_name):
            self.engine.execute(CreateSchema(self.datasets_schema_name))

    def get_datasets(self) -> list:
        with self.engine.connect() as conn:
            result = conn.execute(text(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = '{}'".format(self.datasets_schema_name)
            ))
        return [x['table_name'] for x in result.fetchall()]

    def save_dataset(self, df: pd.DataFrame, ds_name: str, do_upsert=False) -> bool:
        conn = self.engine.connect()
        res = False
        try:
            df.to_sql(ds_name, conn, if_exists='replace' if do_upsert is False else 'append', schema=self.datasets_schema_name)
            res = True
        except Exception as e:
            logging.error("Failed to write df: {}".format(e))
        conn.close
        return res

