from fastapi import FastAPI

from db_manager import DbPlainManager
from handlers import apply_handlers

db = DbPlainManager()
db.create_tables()

app = FastAPI()

apply_handlers(app)
