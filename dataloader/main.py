from fastapi import FastAPI

from db_manager import DbManager
from handlers import apply_handlers

db = DbManager()
db.create_tables()

app = FastAPI()

apply_handlers(app)
