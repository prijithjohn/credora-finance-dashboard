from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.reward import RewardRead, RewardSummary, RewardRedemptionRequest, RewardRedemptionResponse
from app.services.reward_service import RewardService

router = APIRouter(prefix='/api', tags=['rewards'])


@router.get('/rewards', response_model=list[RewardRead])
def get_rewards(db: Session = Depends(get_db)) -> list[RewardRead]:
    service = RewardService(db)
    rewards = service.list_rewards()
    return [RewardRead.model_validate(reward) for reward in rewards]


@router.get('/rewards/balance', response_model=RewardSummary)
def get_rewards_balance(db: Session = Depends(get_db)) -> RewardSummary:
    service = RewardService(db)
    user_balance = service.get_balance()
    rewards = service.list_rewards()
    return RewardSummary(current_balance=user_balance, rewards=[RewardRead.model_validate(reward) for reward in rewards])


@router.post('/rewards/redeem', response_model=RewardRedemptionResponse)
def redeem_reward(payload: RewardRedemptionRequest, db: Session = Depends(get_db)) -> RewardRedemptionResponse:
    service = RewardService(db)
    try:
        user, reward, redemption = service.redeem_reward(payload.reward_id, payload.user_id)
        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to redeem reward')

    return RewardRedemptionResponse(
        success=True,
        message='Reward redeemed',
        reward_id=reward.id,
        reward_name=reward.name,
        user_id=user.id,
        redemption_id=redemption.id,
        coins_spent=redemption.coins_spent,
        remaining_balance=user.coin_balance,
    )
