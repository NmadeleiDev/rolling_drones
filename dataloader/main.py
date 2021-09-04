from fastapi import FastAPI

from handlers import apply_handlers

app = FastAPI()

@app.get("/test", status_code=200)
def test_handler():
    return {'data': 'OK!', 'error': None}

apply_handlers(app)
