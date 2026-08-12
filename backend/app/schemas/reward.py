from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


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
    reward_id: int = Field(..., gt=0)
    user_id: int = Field(default=1, gt=0)


class RewardRedemptionResponse(BaseModel):
    success: bool
    message: str
    reward_id: int | None = None
    reward_name: str | None = None
    user_id: int | None = None
    redemption_id: int | None = None
    coins_spent: int | None = None
    remaining_balance: int | None = None
