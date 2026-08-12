from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timezone
from decimal import Decimal
from typing import Literal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.transaction import Transaction


@dataclass(frozen=True)
class TransactionListFilter:
    page: int = 1
    page_size: int = 20
    merchant: str | None = None
    category: str | None = None
    status: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    min_amount: Decimal | None = None
    max_amount: Decimal | None = None
    sort_by: Literal['date', 'amount'] = 'date'
    sort_order: Literal['asc', 'desc'] = 'desc'


class TransactionRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_transactions(self, filters: TransactionListFilter) -> tuple[list[Transaction], int]:
        stmt = select(Transaction)

        if filters.merchant:
            stmt = stmt.where(func.lower(Transaction.merchant).like(f"%{filters.merchant.lower()}%"))
        if filters.category:
            stmt = stmt.where(func.lower(Transaction.category) == filters.category.lower())
        if filters.status:
            stmt = stmt.where(func.lower(Transaction.status) == filters.status.lower())
        if filters.start_date is not None:
            start_dt = datetime.combine(filters.start_date, time.min, tzinfo=timezone.utc)
            stmt = stmt.where(Transaction.transaction_date >= start_dt)
        if filters.end_date is not None:
            end_dt = datetime.combine(filters.end_date, time.max, tzinfo=timezone.utc)
            stmt = stmt.where(Transaction.transaction_date <= end_dt)
        if filters.min_amount is not None:
            stmt = stmt.where(Transaction.amount >= filters.min_amount)
        if filters.max_amount is not None:
            stmt = stmt.where(Transaction.amount <= filters.max_amount)

        total_stmt = select(func.count()).select_from(stmt.order_by(None).subquery())
        total = self.db.execute(total_stmt).scalar_one()

        sort_column = Transaction.transaction_date if filters.sort_by == 'date' else Transaction.amount
        order_expr = sort_column.asc() if filters.sort_order == 'asc' else sort_column.desc()
        stmt = stmt.order_by(order_expr)

        offset = (filters.page - 1) * filters.page_size
        stmt = stmt.limit(filters.page_size).offset(offset)

        items = self.db.execute(stmt).scalars().all()
        return items, total

    def get_by_id(self, transaction_id: int) -> Transaction | None:
        return self.db.get(Transaction, transaction_id)
