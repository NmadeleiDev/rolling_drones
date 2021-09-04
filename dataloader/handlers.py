import logging
from fastapi import FastAPI, Response, File, UploadFile, Form

from pydantic import BaseModel
from typing import Optional

import pandas as pd

from db import DbManager

def success_response(msg: any):
    return {'error': None, 'data': msg}

def error_response(msg: any):
    return {'error': msg, 'data': None}

def apply_handlers(app: FastAPI):
    @app.get("/test", status_code=200)
    def test_handler():
        return success_response('ok')

    @app.get("/data", status_code=200)
    def get_datasets(response: Response):
        db = DbManager()
        dss = db.get_datasets()
        return success_response(dss)

    @app.post("/data", status_code=200)
    async def save_dataset(response: Response, file: UploadFile = Form('file'), name: str = Form('name')):
        logging.info("Filename: {}, name: {}".format(file.filename, name))
        df = read_file_to_dataframe(file.filename, await file.read())

        if df is None:
            return error_response('error reading file: {}'.format(file.filename))

        df.to_csv('test.csv')
        db = DbManager()
        db.save_dataset(df, name)
        return success_response('saved!')


    @app.put("/data", status_code=200)
    async def update_dataset(file: UploadFile, name: str, response: Response):
        df = read_file_to_dataframe(file.filename, file)
        if df is None:
            return error_response('error reading file: {}'.format(file.filename))

        db = DbManager()
        db.update_dataset(df, name)
        return success_response('updated!')

def read_file_to_dataframe(filename: str, data) -> pd.DataFrame:
    ext = filename.split('.')[-1]
    if ext == 'csv':
        df = pd.read_csv(data)
    if ext == 'tsv':
        df = pd.read_csv(data, delimiter='\t')
    elif ext == 'xlsx':
        df = pd.read_excel(data)
    else:
        return None

    if isinstance(df.columns, pd.MultiIndex):
        logging.info(df.columns)
        df.columns = ['__'.join(x) for x in df.columns.to_flat_index()]

    return df.convert_dtypes()
        