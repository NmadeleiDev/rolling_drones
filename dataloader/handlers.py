import logging
from fastapi import FastAPI, Response, File, UploadFile, Form, status

from pydantic import BaseModel
from typing import Optional, Union

import pandas as pd

from db import DbManager

forecaset_ds_suffix = 'forecast'
fact_ds_suffix = 'fact'
suffix_link = '__'

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
        return success_response([x.split(suffix_link) for x in dss])

    @app.post("/data", status_code=200)
    async def save_dataset(response: Response,
                            file_forecast: Optional[UploadFile] = Form('file_forecast'),
                            file_fact: Optional[UploadFile] = Form('file_fact'),
                            name: str = Form('name')):
        return await save_files(file_forecast, file_fact, response, name, False)

    @app.put("/data", status_code=200)
    async def save_dataset(response: Response,
                            file_forecast: Optional[UploadFile] = Form('file_forecast'),
                            file_fact: Optional[UploadFile] = Form('file_fact'),
                            name: str = Form('name')):
        return await save_files(file_forecast, file_fact, response, name, True)

async def save_files(file_forecast: any, file_fact: any, response: Response, name: str, do_upsert=False):
    db = DbManager()

    ok1, ok2 = None, None
    saved = []
    if hasattr(file_forecast, 'filename'):
        df_forecast = read_file_to_dataframe(file_forecast.filename, await file_forecast.read())
        if df_forecast is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_forecast.filename))
        ok1 = db.save_dataset(select_cols_for_forecasts_df(df_forecast), name + suffix_link + forecaset_ds_suffix, do_upsert=do_upsert)
        saved.append(file_forecast.filename)

    if hasattr(file_fact, 'filename'):
        df_fact = read_file_to_dataframe(file_fact.filename, await file_fact.read())
        if file_fact is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_fact.filename))
        ok2 = db.save_dataset(select_cols_for_facts_df(df_fact), name + suffix_link + fact_ds_suffix, do_upsert=do_upsert)
        saved.append(file_fact.filename)

    return success_response('Saved {} with name "{}"'.format(', '.join(saved), name))

def read_file_to_dataframe(filename: str, data) -> pd.DataFrame:
    ext = filename.split('.')[-1].lower()
    if ext == 'csv':
        df = pd.read_csv(data)
    if ext == 'tsv':
        df = pd.read_csv(data, delimiter='\t')
    elif ext == 'xlsx' or ext == 'xls':
        df = pd.read_excel(data)
    else:
        return None

    if isinstance(df.columns, pd.MultiIndex):
        logging.info(df.columns)
        df.columns = ['__'.join(x) for x in df.columns.to_flat_index()]

    return df.convert_dtypes()

def select_cols_for_forecasts_df(df: pd.DataFrame) -> pd.DataFrame:
    take_col_idx = [0, 2, 3, 4, 6, 9, 12]
    return pd.DataFrame(df.to_numpy()[:, take_col_idx])
        
def select_cols_for_facts_df(df: pd.DataFrame) -> pd.DataFrame:
    take_col_idx = [1, 5]
    return pd.DataFrame(df.to_numpy()[:, take_col_idx])