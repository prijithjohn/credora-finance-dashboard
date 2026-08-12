from __future__ import annotations

from datetime import datetime

from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Transaction(Base):
    __tablename__ = 'transactions'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    source_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    merchant: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    category: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, index=True)
    currency: Mapped[str] = mapped_column(String(10), default='INR', nullable=False)
    transaction_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    raw_timestamp: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    payment_method: Mapped[str | None] = mapped_column(String(80), nullable=True)
    account_name: Mapped[str | None] = mapped_column(String(120), nullable=True)

    user: Mapped['User'] = relationship(back_populates='transactions')

    __table_args__ = (
        Index('ix_transactions_user_date', 'user_id', 'transaction_date'),
        Index('ix_transactions_user_category', 'user_id', 'category'),
        Index('ix_transactions_user_status', 'user_id', 'status'),
        Index('ix_transactions_merchant_status_date', 'merchant', 'status', 'transaction_date'),
        Index('ix_transactions_amount_date', 'amount', 'transaction_date'),
    )
