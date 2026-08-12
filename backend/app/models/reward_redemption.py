from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class RewardRedemption(Base):
    __tablename__ = 'reward_redemptions'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    reward_id: Mapped[int] = mapped_column(ForeignKey('rewards.id', ondelete='RESTRICT'), nullable=False, index=True)
    coins_spent: Mapped[int] = mapped_column(Integer, nullable=False)
    redeemed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True)

    user: Mapped['User'] = relationship(back_populates='reward_redemptions')
    reward: Mapped['Reward'] = relationship(back_populates='redemptions')
