from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.reward import Reward
from app.models.reward_redemption import RewardRedemption
from app.models.user import User
from app.repositories.reward_repository import RewardRepository


class RewardService:
    def __init__(self, db: Session) -> None:
        self.repository = RewardRepository(db)
        self.db = db

    def list_rewards(self) -> list[Reward]:
        return self.repository.list_active_rewards()

    def get_balance(self) -> int:
        user = self.repository.get_demo_user()
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Demo user not found')
        return user.coin_balance

    def redeem_reward(self, reward_id: int, user_id: int | None = None) -> tuple[User, Reward, RewardRedemption]:
        target_user_id = user_id if user_id is not None else self.repository.get_demo_user().id if self.repository.get_demo_user() else None
        if target_user_id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')

        reward = self.repository.get_reward_for_update(reward_id)
        if reward is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Reward not found')
        if not reward.active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Reward is inactive')

        user = self.repository.get_user_for_update(target_user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')

        if user.coin_balance < reward.coin_cost:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Insufficient balance')

        if self.repository.get_existing_redemption(user.id, reward.id) is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Reward already redeemed by this user')

        user.coin_balance -= reward.coin_cost
        redemption = self.repository.create_redemption(user_id=user.id, reward_id=reward.id, coins_spent=reward.coin_cost)
        self.db.flush()
        return user, reward, redemption
