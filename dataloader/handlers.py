import logging
from os import name
from fastapi import FastAPI, Response, File, UploadFile, Form, status

from pydantic import BaseModel
from typing import Optional, Union

import pandas as pd
import numpy as np
import json

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
        names = [parse_file_name(x) for x in dss]
        years = set([x['year'] for x in names])
        result = [{'year': y, 'forecast': bool(np.any([(x['year'] == y and x['type'] == 'forecast') for x in names if len(x.keys()) == 2]) == True), 'fact': bool(np.any([x['year'] == y and x['type'] == 'fact' for x in names if len(x.keys()) == 2]) == True)} for y in years]
        return success_response(result)

    @app.post("/data", status_code=200)
    async def save_dataset(response: Response,
                            file_forecast: Optional[UploadFile] = Form('file_forecast'),
                            file_fact: Optional[UploadFile] = Form('file_fact'),
                            year: str = Form(None)):
        if name is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Field "name" must be defined')
        if year is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Field "year" must be defined')
        return await save_files(file_forecast, file_fact, response, year, False)

    # @app.put("/data", status_code=200)
    # async def save_dataset(response: Response,
    #                         file_forecast: Optional[UploadFile] = Form('file_forecast'),
    #                         file_fact: Optional[UploadFile] = Form('file_fact'),
    #                         name: str = Form(),
    #                         year: str = Form()):
    #     return await save_files(file_forecast, file_fact, response, name, year, True)


def make_table_name(year: str, suffix: str) -> str:
    return suffix_link.join([year, suffix])

def parse_file_name(name: str) -> dict:
    parts = name.split(suffix_link)
    if len(parts) != 2:
        logging.error("Invalid name: {}".format(name))
        return {}
    else:
        return dict(zip(['year', 'type'], parts))

async def save_files(file_forecast: any, file_fact: any, response: Response, year: str, do_upsert=False):
    db = DbManager()

    saved = []
    if hasattr(file_forecast, 'filename'):
        df_forecast = read_file_to_dataframe(file_forecast.filename, await file_forecast.read())
        if df_forecast is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_forecast.filename))
        db.save_dataset(select_cols_for_forecasts_df(df_forecast), make_table_name(year, forecaset_ds_suffix), do_upsert=do_upsert)
        saved.append(file_forecast.filename)

    if hasattr(file_fact, 'filename'):
        df_fact = read_file_to_dataframe(file_fact.filename, await file_fact.read())
        if file_fact is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_fact.filename))
        db.save_dataset(select_cols_for_facts_df(df_fact), make_table_name(year, fact_ds_suffix), do_upsert=do_upsert)
        saved.append(file_fact.filename)

    return success_response('Saved {} for year "{}"'.format(', '.join(saved), year))

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