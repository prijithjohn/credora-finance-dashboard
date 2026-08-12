from fastapi import FastAPI

from app.api.routes.transactions import router as transactions_router

app = FastAPI(title='Credora API', version='0.1.0')
app.include_router(transactions_router)


@app.get('/health')
def health_check() -> dict[str, str]:
    return {'status': 'ok'}
