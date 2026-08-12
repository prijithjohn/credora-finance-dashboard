from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Literal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.repositories.transaction_repository import TransactionListFilter, TransactionRepository


class TransactionService:
    def __init__(self, db: Session) -> None:
        self.repository = TransactionRepository(db)

    def list_transactions(
        self,
        *,
        page: int,
        page_size: int,
        merchant: str | None,
        category: str | None,
        status: str | None,
        start_date: date | None,
        end_date: date | None,
        min_amount: Decimal | None,
        max_amount: Decimal | None,
        sort_by: Literal['date', 'amount'],
        sort_order: Literal['asc', 'desc'],
    ) -> tuple[list[Transaction], int, int, int]:
        filters = TransactionListFilter(
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
        items, total = self.repository.list_transactions(filters)
        total_pages = (total + page_size - 1) // page_size if total else 0
        return items, total, page, total_pages

    def get_transaction(self, transaction_id: int) -> Transaction:
        transaction = self.repository.get_by_id(transaction_id)
        if transaction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Transaction {transaction_id} not found',
            )
        return transaction
