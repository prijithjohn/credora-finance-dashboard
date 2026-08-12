from fastapi import FastAPI

from app.api.routes.rewards import router as rewards_router
from app.api.routes.transactions import router as transactions_router

app = FastAPI(title='Credora API', version='0.1.0')
app.include_router(transactions_router)
app.include_router(rewards_router)


@app.get('/health')
def health_check() -> dict[str, str]:
    return {'status': 'ok'}
