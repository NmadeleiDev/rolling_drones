from fastapi import FastAPI

from handlers import apply_handlers

app = FastAPI()
apply_handlers(app)
