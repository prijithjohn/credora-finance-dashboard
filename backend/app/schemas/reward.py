from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class RewardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    coin_cost: int
    active: bool = True
    image_url: str | None = None


class RewardSummary(BaseModel):
    current_balance: int
    rewards: list[RewardRead]


class RewardRedemptionRequest(BaseModel):
    reward_id: int
    user_id: int = 1


class RewardRedemptionResponse(BaseModel):
    success: bool
    message: str
    reward_name: str | None = None
    remaining_balance: int | None = None
