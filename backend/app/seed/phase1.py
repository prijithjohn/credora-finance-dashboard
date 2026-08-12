from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.reward import Reward
from app.models.transaction import Transaction
from app.models.user import User

SOURCE_PATH = Path(__file__).resolve().parents[3] / 'data' / 'transactions.json'


def load_source_transactions() -> list[dict[str, Any]]:
    data = json.loads(SOURCE_PATH.read_text(encoding='utf-8'))
    if not isinstance(data, list):
        raise TypeError('Source transactions dataset must be a list of records.')
    return data


def is_missing_category(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ''
    return False


def audit_source_transactions(records: list[dict[str, Any]]) -> dict[str, Any]:
    field_names = sorted(records[0].keys()) if records else []
    duplicate_source_id_count = sum(1 for count in Counter(item.get('id') for item in records).values() if count > 1)
    missing_category_count = sum(1 for item in records if 'category' not in item or is_missing_category(item.get('category')))
    normalized_status_count = sum(1 for item in records if str(item.get('status', '')).strip().upper() != str(item.get('status', '')).strip())
    timestamp_normalization_failures = 0

    for item in records:
        raw_value = item.get('timestamp')
        if isinstance(raw_value, (int, float)):
            continue
        if not isinstance(raw_value, str):
            timestamp_normalization_failures += 1
            continue
        value = raw_value.strip()
        if not value:
            timestamp_normalization_failures += 1
            continue
        try:
            _parse_datetime_value(value)
        except ValueError:
            timestamp_normalization_failures += 1

    return {
        'source_record_count': len(records),
        'transaction_field_count': len(field_names),
        'source_id_field': 'id',
        'field_names': field_names,
        'duplicate_source_id_count': duplicate_source_id_count,
        'missing_category_count': missing_category_count,
        'normalized_status_count': normalized_status_count,
        'timestamp_normalization_failures': timestamp_normalization_failures,
    }


def _parse_datetime_value(value: str) -> datetime:
    if 'T' in value or 'Z' in value:
        return datetime.fromisoformat(value.replace('Z', '+00:00'))

    if '/' in value:
        slash_formats = ['%m/%d/%Y %H:%M:%S', '%d/%m/%Y %H:%M:%S', '%m/%d/%Y', '%d/%m/%Y']
        for fmt in slash_formats:
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue

    if ' ' in value:
        for fmt in ['%Y-%m-%d %H:%M:%S', '%Y/%m/%d %H:%M:%S']:
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue

    return datetime.fromisoformat(value)


def normalize_timestamp(raw_value: Any) -> datetime:
    if isinstance(raw_value, (int, float)):
        epoch_value = float(raw_value)
        if abs(epoch_value) >= 1_000_000_000_000:
            epoch_value /= 1000
        return datetime.fromtimestamp(epoch_value, tz=timezone.utc)
    if not isinstance(raw_value, str):
        raise ValueError(f'Unsupported timestamp type: {type(raw_value).__name__}')

    value = raw_value.strip()
    if not value:
        raise ValueError('Empty timestamp value')

    if value.isdigit() or (value.startswith('-') and value[1:].isdigit()):
        epoch_value = float(value)
        if abs(epoch_value) >= 1_000_000_000_000:
            epoch_value /= 1000
        return datetime.fromtimestamp(epoch_value, tz=timezone.utc)

    dt = _parse_datetime_value(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def normalize_status(value: Any) -> str:
    return str(value).strip().upper() if value is not None else 'UNKNOWN'


def normalize_category(value: Any) -> str:
    if is_missing_category(value):
        return 'Uncategorized'
    return str(value).strip()


def build_reward_seed() -> list[dict[str, Any]]:
    return [
        {'name': 'Coffee Credit', 'description': 'A quick coffee perk for daily spending.', 'coin_cost': 150, 'active': True, 'image_url': None},
        {'name': 'Movie Night', 'description': 'Two movie tickets or a streaming bundle.', 'coin_cost': 300, 'active': True, 'image_url': None},
        {'name': 'Groceries Boost', 'description': 'A grocery top-up for home essentials.', 'coin_cost': 450, 'active': True, 'image_url': None},
        {'name': 'Travel Voucher', 'description': 'A travel credit for your next getaway.', 'coin_cost': 700, 'active': True, 'image_url': None},
        {'name': 'Premium Learning', 'description': 'Unlock premium learning resources.', 'coin_cost': 900, 'active': True, 'image_url': None},
    ]


def ensure_demo_user(db: Session) -> User:
    user = db.scalar(select(User).where(User.email == 'demo@credora.app'))
    if user is None:
        user = User(email='demo@credora.app', first_name='Demo', last_name='User', coin_balance=0)
        db.add(user)
        db.flush()
    return user


def ensure_rewards(db: Session) -> list[Reward]:
    rewards: list[Reward] = []
    for payload in build_reward_seed():
        reward = db.scalar(select(Reward).where(Reward.name == payload['name']))
        if reward is None:
            reward = Reward(
                name=payload['name'],
                description=payload['description'],
                coin_cost=payload['coin_cost'],
                active=payload['active'],
                image_url=payload['image_url'],
            )
            db.add(reward)
            db.flush()
        rewards.append(reward)
    return rewards


def seed_transactions(db: Session, user_id: int) -> dict[str, Any]:
    records = load_source_transactions()
    audit = audit_source_transactions(records)
    inserted_count = 0

    for row in records:
        source_id = str(row.get('id'))
        amount = Decimal(str(row.get('amount')))
        transaction = Transaction(
            user_id=user_id,
            source_id=source_id,
            merchant=str(row.get('merchant', '')).strip() or 'Unknown Merchant',
            category=normalize_category(row.get('category')),
            status=normalize_status(row.get('status')),
            amount=amount,
            currency=str(row.get('currency', 'INR')).strip() or 'INR',
            transaction_date=normalize_timestamp(row.get('timestamp')),
            raw_timestamp=str(row.get('timestamp')),
            source_name='transactions.json',
            description=None,
            payment_method=str(row.get('payment_method', '')).strip() or None,
            account_name=None,
        )
        db.add(transaction)
        inserted_count += 1

    db.flush()
    duplicate_source_id_count = db.execute(
        select(func.count()).select_from(
            select(Transaction.source_id, func.count(Transaction.id).label('duplicate_count'))
            .group_by(Transaction.source_id)
            .having(func.count(Transaction.id) > 1)
            .subquery()
        )
    ).scalar_one()

    return {
        'source_record_count': audit['source_record_count'],
        'inserted_record_count': inserted_count,
        'duplicate_source_id_count': audit['duplicate_source_id_count'],
        'duplicate_source_ids_retained': duplicate_source_id_count,
        'missing_category_count': audit['missing_category_count'],
        'normalized_status_count': audit['normalized_status_count'],
        'timestamp_normalization_failures': audit['timestamp_normalization_failures'],
    }


def run_phase1_seed() -> dict[str, Any]:
    db = SessionLocal()
    try:
        user = ensure_demo_user(db)
        ensure_rewards(db)
        result = seed_transactions(db, user.id)
        db.commit()
        result['demo_user_email'] = user.email
        return result
    finally:
        db.close()


if __name__ == '__main__':
    print(json.dumps(run_phase1_seed(), indent=2, sort_keys=True))
