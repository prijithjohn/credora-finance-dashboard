from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.transaction import TransactionListResponse, TransactionRead
from app.services.transaction_service import TransactionService

router = APIRouter(prefix='/api', tags=['transactions'])


@router.get('/transactions', response_model=TransactionListResponse)
def list_transactions(
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    merchant: Annotated[str | None, Query(max_length=255)] = None,
    category: Annotated[str | None, Query(max_length=120)] = None,
    status: Annotated[str | None, Query(max_length=40)] = None,
    start_date: date | None = None,
    end_date: date | None = None,
    min_amount: Decimal | None = Query(default=None, ge=0),
    max_amount: Decimal | None = Query(default=None, ge=0),
    sort_by: Literal['date', 'amount'] = Query(default='date', description='Sort by transaction date or amount'),
    sort_order: Literal['asc', 'desc'] = Query(default='desc', description='Sort order'),
    db: Session = Depends(get_db),
) -> TransactionListResponse:
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='start_date must be less than or equal to end_date',
        )
    if min_amount is not None and max_amount is not None and min_amount > max_amount:
        raise HTTPException(
            status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='min_amount must be less than or equal to max_amount',
        )

    service = TransactionService(db)
    items, total, page, total_pages = service.list_transactions(
        page=page,
        page_size=page_size,
        merchant=merchant,
        category=category,
        status=status,
        start_date=start_date,
        end_date=end_date,
        min_amount=min_amount,
        max_amount=max_amount,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    return TransactionListResponse(
        items=[TransactionRead.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get('/transactions/{transaction_id}', response_model=TransactionRead)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
) -> TransactionRead:
    service = TransactionService(db)
    transaction = service.get_transaction(transaction_id)
    return TransactionRead.model_validate(transaction)
