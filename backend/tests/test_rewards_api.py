from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.reward import Reward
from app.models.reward_redemption import RewardRedemption
from app.models.user import User
from app.main import app

client = TestClient(app)


def _reset_demo_state(balance: int = 5000) -> None:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        if user is None:
            raise AssertionError('Demo user missing')
        user.coin_balance = balance
        db.execute(
            select(RewardRedemption).where(RewardRedemption.user_id == user.id)
        )
        for redemption in db.execute(
            select(RewardRedemption).where(RewardRedemption.user_id == user.id)
        ).scalars().all():
            db.delete(redemption)
        db.commit()
    finally:
        db.close()


def _current_balance() -> int:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        return int(user.coin_balance) if user is not None else 0
    finally:
        db.close()


def _reward_cost(reward_id: int) -> int:
    db = SessionLocal()
    try:
        reward = db.get(Reward, reward_id)
        return int(reward.coin_cost) if reward is not None else 0
    finally:
        db.close()


def _redemption_exists(user_id: int, reward_id: int) -> bool:
    db = SessionLocal()
    try:
        exists = db.execute(
            select(RewardRedemption.id).where(
                RewardRedemption.user_id == user_id,
                RewardRedemption.reward_id == reward_id,
            )
        ).first() is not None
        return exists
    finally:
        db.close()


def _user_by_id(user_id: int) -> User | None:
    db = SessionLocal()
    try:
        return db.get(User, user_id)
    finally:
        db.close()


def test_get_rewards_returns_active_rewards() -> None:
    response = client.get('/api/rewards')

    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    assert len(payload) >= 1
    assert all(item['active'] is True for item in payload)
    assert all('id' in item and 'name' in item and 'coin_cost' in item for item in payload)


def test_get_balance_returns_actual_database_balance() -> None:
    response = client.get('/api/rewards/balance')

    assert response.status_code == 200
    payload = response.json()
    assert payload['current_balance'] == _current_balance()


def test_successful_redemption() -> None:
    _reset_demo_state(5000)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.asc()))
        assert user is not None and reward is not None
        original_balance = user.coin_balance
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        payload = response.json()
        assert response.status_code == 200
        assert payload['success'] is True
        assert payload['remaining_balance'] == original_balance - reward.coin_cost
    finally:
        db.close()


def test_balance_decreases_by_exactly_reward_cost() -> None:
    _reset_demo_state(5000)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.desc()))
        assert user is not None and reward is not None
        before = user.coin_balance
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 200
        refreshed = _user_by_id(user.id)
        assert refreshed is not None
        assert refreshed.coin_balance == before - reward.coin_cost
    finally:
        db.close()


def test_redemption_record_is_created() -> None:
    _reset_demo_state(5000)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.id.asc()))
        assert user is not None and reward is not None
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 200
        assert _redemption_exists(user.id, reward.id)
    finally:
        db.close()


def test_insufficient_balance_rejected() -> None:
    _reset_demo_state(0)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.desc()))
        assert user is not None and reward is not None
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 400
        refreshed = db.get(User, user.id)
        assert refreshed.coin_balance == 0
    finally:
        db.close()


def test_balance_remains_unchanged_after_insufficient_balance_rejection() -> None:
    _reset_demo_state(0)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.desc()))
        assert user is not None and reward is not None
        before = user.coin_balance
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 400
        refreshed = db.get(User, user.id)
        assert refreshed.coin_balance == before
    finally:
        db.close()


def test_invalid_or_nonexistent_reward_rejected() -> None:
    response = client.post('/api/rewards/redeem', json={'reward_id': 999999, 'user_id': 1})
    assert response.status_code == 404


def test_inactive_reward_rejected() -> None:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(False)).limit(1))
        assert user is not None
        if reward is None:
            reward = Reward(name='Inactive Test Reward', description='inactive', coin_cost=1, active=False)
            db.add(reward)
            db.commit()
            db.refresh(reward)
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 400
    finally:
        db.close()


def test_invalid_request_is_rejected() -> None:
    response = client.post('/api/rewards/redeem', json={'reward_id': 0})
    assert response.status_code == 422


def test_failed_redemption_does_not_create_redemption_record() -> None:
    _reset_demo_state(0)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.desc()))
        assert user is not None and reward is not None
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 400
        assert not _redemption_exists(user.id, reward.id)
    finally:
        db.close()


def test_successful_redemption_returns_updated_balance() -> None:
    _reset_demo_state(5000)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.asc()))
        assert user is not None and reward is not None
        response = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert response.status_code == 200
        payload = response.json()
        refreshed = _user_by_id(user.id)
        assert refreshed is not None
        assert payload['remaining_balance'] == refreshed.coin_balance
        assert payload['remaining_balance'] == user.coin_balance - reward.coin_cost
    finally:
        db.close()


def test_repeated_redemption_requests_do_not_corrupt_balance() -> None:
    _reset_demo_state(5000)
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
        reward = db.scalar(select(Reward).where(Reward.active.is_(True)).order_by(Reward.coin_cost.asc()))
        assert user is not None and reward is not None
        first = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        second = client.post('/api/rewards/redeem', json={'reward_id': reward.id, 'user_id': user.id})
        assert first.status_code == 200
        assert second.status_code == 409
        refreshed = _user_by_id(user.id)
        assert refreshed is not None
        assert refreshed.coin_balance >= 0
        assert refreshed.coin_balance == 5000 - reward.coin_cost
    finally:
        db.close()
