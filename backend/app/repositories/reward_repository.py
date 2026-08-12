from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.reward import Reward
from app.models.reward_redemption import RewardRedemption
from app.models.user import User


class RewardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_active_rewards(self) -> list[Reward]:
        stmt = select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.asc(), Reward.id.asc())
        return self.db.execute(stmt).scalars().all()

    def get_demo_user(self) -> User | None:
        return self.db.scalar(select(User).where(User.email == 'demo@credora.app'))

    def get_user(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def get_user_for_update(self, user_id: int) -> User | None:
        stmt = select(User).where(User.id == user_id).with_for_update()
        return self.db.execute(stmt).scalar_one_or_none()

    def get_reward_by_id(self, reward_id: int) -> Reward | None:
        return self.db.get(Reward, reward_id)

    def get_reward_for_update(self, reward_id: int) -> Reward | None:
        stmt = select(Reward).where(Reward.id == reward_id).with_for_update()
        return self.db.execute(stmt).scalar_one_or_none()

    def get_existing_redemption(self, user_id: int, reward_id: int) -> RewardRedemption | None:
        stmt = select(RewardRedemption).where(
            RewardRedemption.user_id == user_id,
            RewardRedemption.reward_id == reward_id,
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def create_redemption(self, *, user_id: int, reward_id: int, coins_spent: int) -> RewardRedemption:
        redemption = RewardRedemption(
            user_id=user_id,
            reward_id=reward_id,
            coins_spent=coins_spent,
        )
        self.db.add(redemption)
        self.db.flush()
        return redemption
