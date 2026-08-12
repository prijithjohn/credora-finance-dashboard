from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source_id: str
    user_id: int
    merchant: str | None = None
    category: str | None = None
    status: str
    amount: Decimal
    currency: str
    transaction_date: datetime
    payment_method: str | None = None
    description: str | None = None
    source_name: str | None = None


class TransactionListResponse(BaseModel):
    items: list[TransactionRead]
    total: int
    page: int
    page_size: int
    total_pages: int
