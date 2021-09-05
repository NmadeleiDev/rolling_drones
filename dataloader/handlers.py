import logging
from os import name
from fastapi import FastAPI, Response, File, UploadFile, Form, status

from pydantic import BaseModel
from typing import Optional, Union

import pandas as pd
import numpy as np

from db_manager import DbManager
from file_parsing import *

forecaset_ds_suffix = 'forecast'
fact_ds_suffix = 'fact'
income_ds_suffix = 'income'
spent_ds_suffix = 'spent'
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
        result = [{'year': y, 'forecast': bool(np.any([(x['year'] == y and x['type'] == forecaset_ds_suffix) for x in names if len(x.keys()) == 2]) == True), 'fact': bool(np.any([x['year'] == y and x['type'] == income_ds_suffix for x in names if len(x.keys()) == 2]) == True) and bool(np.any([x['year'] == y and x['type'] == spent_ds_suffix for x in names if len(x.keys()) == 2]) == True)} for y in years]
        return success_response(result)

    @app.post("/data", status_code=200)
    async def save_dataset(response: Response,
                            file_forecast: Optional[UploadFile] = Form('file_forecast'),
                            file_fact: Optional[UploadFile] = Form('file_fact'),
                            year: str = Form(None)):
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
        df_forecast = list(df_forecast.values())[0]
        db.save_dataset(select_cols_for_forecasts_df(df_forecast), make_table_name(year, forecaset_ds_suffix), do_upsert=do_upsert)
        saved.append(file_forecast.filename)

    if hasattr(file_fact, 'filename'):
        df_fact = read_file_to_dataframe(file_fact.filename, await file_fact.read())
        if df_fact is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('Unknown file extension: {}'.format(file_fact.filename))
        
        for k, v in df_fact.items():
            if re.search('доходы', k, re.IGNORECASE) is not None and isinstance(v, pd.DataFrame):
                db.save_dataset(select_cols_for_facts_df(v), make_table_name(year, income_ds_suffix), do_upsert=do_upsert)
            elif re.search('расходы', k, re.IGNORECASE) is not None and isinstance(v, pd.DataFrame):
                db.save_dataset(select_cols_for_facts_df(v), make_table_name(year, spent_ds_suffix), do_upsert=do_upsert)
        saved.append(file_fact.filename)

    return success_response('Saved {} for year "{}"'.format(', '.join(saved), year))
