from fastapi import FastAPI
import logging

from db_manager import DbManager
from handlers import apply_handlers

logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %H:%M:%S :', level=logging.DEBUG)

db = DbManager()
db.create_tables()

app = FastAPI()

apply_handlers(app)
