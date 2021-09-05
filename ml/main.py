from fastapi import FastAPI
import logging

from db_manager import DbPlainManager
from handlers import apply_handlers

logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %H:%M:%S :', level=logging.DEBUG)

db = DbPlainManager()
db.create_tables()

app = FastAPI()

apply_handlers(app)
