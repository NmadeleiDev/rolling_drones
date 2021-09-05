import logging
from os import name
from fastapi import FastAPI, Response, File, UploadFile, Form, status
from numpy.lib.utils import info

from pydantic import BaseModel
from typing import Optional, Union

import pandas as pd
import numpy as np
from os import path
import json

from db_manager import DbPandasManager, DbPlainManager

from model import predict_outlay, predict, train, train_outlay

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

    @app.get("/predict", status_code=200)
    def get_predict(year: str, response: Response):
        # from_y = int(year)
        # return success_response(({
        #         'income': {
        #             str(from_y + 1): np.random.randint(1000, 10000, (12,)).tolist(),
        #             str(from_y + 2): np.random.randint(1000, 10000, (12,)).tolist(),
        #             str(from_y + 3): np.random.randint(1000, 10000, (12,)).tolist(),
        #         },
        #         'spent': {
        #             str(from_y + 1): np.random.randint(1000, 10000, (12,)).tolist(),
        #             str(from_y + 2): np.random.randint(1000, 10000, (12,)).tolist(),
        #             str(from_y + 3): np.random.randint(1000, 10000, (12,)).tolist(),
        #         }
        #     }))
        ds_db = DbPandasManager()
        info_db = DbPlainManager()

        ser_ds = ds_db.load_dataset(make_table_name(year, "forecast"))
        facts_ds = ds_db.load_dataset(make_table_name(year, "fact"))

        income_model_weights_path = info_db.get_model_weights_filename(make_model_name('income'))
        spent_model_weights_path = info_db.get_model_weights_filename(make_model_name('spent'))
        income_predict = predict(ser_ds, facts_ds, income_model_weights_path)
        spent_predict = predict_outlay(ser_ds, facts_ds, spent_model_weights_path)

        return success_response({'income': income_predict, 'spent': spent_predict})

    @app.get("/train", status_code=200)
    def train_model(response: Response):
        info_db = DbPlainManager()
        ds_db = DbPandasManager()

        dss = info_db.get_dataset_names()

        names = [parse_file_name(x) for x in dss]
        years = set([x['year'] for x in names])
        years_info = [{'year': y, 'forecast': bool(np.any([(x['year'] == y and x['type'] == forecaset_ds_suffix) for x in names if len(x.keys()) == 2]) == True), 'fact': bool(np.any([x['year'] == y and x['type'] == income_ds_suffix for x in names if len(x.keys()) == 2]) == True) and bool(np.any([x['year'] == y and x['type'] == spent_ds_suffix for x in names if len(x.keys()) == 2]) == True)} for y in years]

        take_years = []
        # logging.info("Years info: {}".format(years_info))
        valid_years = [x['year'] for x in years_info if x['forecast'] is True and x['fact'] is True]
        valid_years.sort(key=lambda x: int(x))
        for y in valid_years:
            if len(take_years) > 0 and (int(y) - int(take_years[-1])) != 1:
                break
            take_years.append(y)

        if len(take_years) < 1:
            return error_response('Not enoght data to train model. We need a sequence of periods, got: {}'.format([x['year'] for x in years_info if x['forecast'] is True and x['fact'] is True]))

        take_years.sort(key=lambda x: int(x))

        logging.info("Training on {}".format(take_years))

        ser_samples = []
        income_samples = []
        spent_samples = []

        for y in take_years:
            ser_samples.append(ds_db.load_dataset(make_table_name(y, forecaset_ds_suffix)))
            income_samples.append(ds_db.load_dataset(make_table_name(y, income_ds_suffix)))
            spent_samples.append(ds_db.load_dataset(make_table_name(y, spent_ds_suffix)))

        logging.info("Datasets: {} {} {}".format(ser_samples, income_samples, spent_samples))

        income_model_weights_file_name = 'income'
        spent_model_weights_file_name = 'spent'
        inc_train_ok , spent_train_ok = False, False
        msgs = []
        try:
            train(ser_samples, income_samples, income_model_weights_file_name)
            inc_train_ok = True
            msgs.append('Trained income model')
            info_db.save_model_info(income_model_weights_file_name, make_model_path(income_model_weights_file_name))
        except Exception as e:
            logging.error("Error training income model: {}".format(e))
            msgs.append('Failed to train income model: {}'.format(e))
        try:
            train_outlay(ser_samples, spent_samples, spent_model_weights_file_name)
            inc_train_ok = True
            msgs.append('Trained spent model')
            info_db.save_model_info(spent_model_weights_file_name, make_model_path(spent_model_weights_file_name))
        except Exception as e:
            logging.error("Error training spent model: {}".format(e))
            msgs.append('Failed to train spent model: {}'.format(e))
        
        return success_response('Training finished. Results: {}'.format(msgs))


def make_model_path(name: str):
    return path.join('/app/', name)

def make_table_name(year: str, suffix: str) -> str:
    return suffix_link.join([year, suffix])

def make_model_name(name: str) -> str:
    return 'model_{}.h5'.format(name)

def parse_file_name(name: str) -> dict:
    parts = name.split(suffix_link)
    if len(parts) != 2:
        logging.error("Invalid name: {}".format(name))
        return {}
    else:
        return dict(zip(['year', 'type'], parts))
