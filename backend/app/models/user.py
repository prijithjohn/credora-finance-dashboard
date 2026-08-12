from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    coin_balance: Mapped[int] = mapped_column(default=0, nullable=False)

    transactions: Mapped[list['Transaction']] = relationship(back_populates='user', cascade='all, delete-orphan')
    reward_redemptions: Mapped[list['RewardRedemption']] = relationship(back_populates='user', cascade='all, delete-orphan')
