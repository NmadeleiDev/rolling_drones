from fastapi import FastAPI, Response, File, UploadFile

from pydantic import BaseModel
from typing import Optional

import pandas as pd

from db import DbManager

def apply_handlers(app: FastAPI):
    @app.get("/", status_code=200)
    def test_handler():
        return {'data': 'OK!', 'error': None}

    @app.get("/data", status_code=200)
    def get_datasets(response: Response):
        db = DbManager()
        dss = db.get_datasets()
        return {'data': dss, 'error': None}

    @app.post("/data", status_code=200)
    def save_dataset(file: UploadFile, name: str, response: Response):
        df = read_file_to_dataframe(file.filename, file)
        db = DbManager()
        db.save_dataset(df, name)

    @app.put("/data", status_code=200)
    def update_dataset(file: UploadFile, name: str, response: Response):
        df = read_file_to_dataframe(file.filename, file)
        db = DbManager()
        db.update_dataset(df, name)

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

    return df.convert_dtypes()
        