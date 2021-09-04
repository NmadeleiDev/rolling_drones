import logging
from fastapi import FastAPI, Response, File, UploadFile, Form, status

from pydantic import BaseModel
from typing import Optional

import pandas as pd

from db import DbManager

forecaset_ds_suffix = 'forecast'
fact_ds_suffix = 'fact'

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
    async def save_dataset(response: Response,
                            file_forecast: UploadFile = Form('file_forecast'),
                            file_fact: UploadFile = Form('file_fact'),
                            name: str = Form('name')):
        df_forecast = read_file_to_dataframe(file_forecast.filename, await file_forecast.read())
        df_fact = read_file_to_dataframe(file_fact.filename, await file_fact.read())

        if df_forecast is None or df_fact is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_forecast.filename if df_forecast is None else file_fact.filename))

        # df.to_csv('test.csv')
        db = DbManager()
        ok1 = db.save_dataset(select_cols_for_forecasts_df(df_forecast), name + '_' + forecaset_ds_suffix, do_upsert=False)
        ok2 = db.save_dataset(select_cols_for_facts_df(df_fact), name + '_' + fact_ds_suffix, do_upsert=False)
        if ok1 and ok2:
            return success_response('Saved {} with name "{}"'.format(', '.join([file_forecast.filename, file_fact.filename]), name))
        else:
            err = []
            if ok1 is False:
                err.append(file_forecast.filename)
            if ok2 is False:
                err.append(file_fact.filename)
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Failed to save files: {}'.format(err))

    @app.put("/data", status_code=200)
    async def update_dataset(response: Response,
                            file_forecast: UploadFile = Form('file_forecast'),
                            file_fact: UploadFile = Form('file_fact'),
                            name: str = Form('name')):
        df_forecast = read_file_to_dataframe(file_forecast.filename, await file_forecast.read())
        df_fact = read_file_to_dataframe(file_fact.filename, await file_fact.read())

        if df_forecast is None or df_fact is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_forecast.filename if df_forecast is None else file_fact.filename))

        # df.to_csv('test.csv')
        db = DbManager()
        ok1 = db.save_dataset(select_cols_for_forecasts_df(df_forecast), name + '_' + forecaset_ds_suffix, do_upsert=True)
        ok2 = db.save_dataset(select_cols_for_facts_df(df_fact), name + '_' + fact_ds_suffix, do_upsert=True)
        if ok1 and ok2:
            return success_response('Saved {} with name "{}"'.format(', '.join([file_forecast.filename, file_fact.filename]), name))
        else:
            err = []
            if ok1 is False:
                err.append(file_forecast.filename)
            if ok2 is False:
                err.append(file_fact.filename)
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Failed to save files: {}'.format(err))

def read_file_to_dataframe(filename: str, data) -> pd.DataFrame:
    ext = filename.split('.')[-1]
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