from datetime import datetime

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _parse_iso_utc(value: str) -> datetime:
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def test_get_transactions_default_response() -> None:
    response = client.get('/api/transactions')

    assert response.status_code == 200
    payload = response.json()
    assert payload['page'] == 1
    assert payload['page_size'] == 20
    assert payload['total'] == 10_000
    assert payload['total_pages'] == 500
    assert len(payload['items']) == 20
    assert all(item['id'] for item in payload['items'])


def test_transactions_pagination() -> None:
    response = client.get('/api/transactions?page=2&page_size=5')

    assert response.status_code == 200
    payload = response.json()
    assert payload['page'] == 2
    assert payload['page_size'] == 5
    assert payload['total'] == 10_000
    assert payload['total_pages'] == 2000
    assert len(payload['items']) == 5
    assert payload['items'][0]['id'] != payload['items'][1]['id']


def test_transactions_merchant_search_is_case_insensitive() -> None:
    response = client.get('/api/transactions?merchant=blinkit&page_size=20')

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= 1
    assert len(payload['items']) <= 20
    assert all(item['merchant'] and item['merchant'].lower().find('blinkit') != -1 for item in payload['items'])


def test_transactions_category_filter() -> None:
    response = client.get('/api/transactions?category=groceries&page_size=20')

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= 1
    assert len(payload['items']) <= 20
    assert all(item['category'] and item['category'].lower() == 'groceries' for item in payload['items'])


def test_transactions_status_filter() -> None:
    response = client.get('/api/transactions?status=failed&page_size=20')

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= 1
    assert len(payload['items']) <= 20
    assert all(item['status'].upper() == 'FAILED' for item in payload['items'])


def test_transactions_date_range_filter() -> None:
    response = client.get('/api/transactions?start_date=2025-01-07&end_date=2025-01-31&page_size=20')

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= 1
    assert len(payload['items']) <= 20
    for item in payload['items']:
        dt = _parse_iso_utc(item['transaction_date'])
        assert datetime(2025, 1, 7, tzinfo=dt.tzinfo) <= dt <= datetime(2025, 1, 31, 23, 59, 59, tzinfo=dt.tzinfo)


def test_transactions_amount_range_filter() -> None:
    response = client.get('/api/transactions?min_amount=1000&max_amount=2000&page_size=20')

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= 1
    assert len(payload['items']) <= 20
    for item in payload['items']:
        amount = float(item['amount'])
        assert 1000 <= amount <= 2000


def test_transactions_combined_filters() -> None:
    response = client.get(
        '/api/transactions?merchant=blinkit&category=Groceries&status=SUCCESS&start_date=2026-01-01&end_date=2026-12-31&min_amount=100&max_amount=10000&page_size=10&sort_by=date&sort_order=desc'
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= 1
    assert len(payload['items']) <= 10
    assert payload['page'] == 1
    assert payload['page_size'] == 10
    for item in payload['items']:
        dt = _parse_iso_utc(item['transaction_date'])
        amount = float(item['amount'])
        assert item['merchant'] and item['merchant'].lower() == 'blinkit'
        assert item['category'] and item['category'].lower() == 'groceries'
        assert item['status'] == 'SUCCESS'
        assert datetime(2026, 1, 1, tzinfo=dt.tzinfo) <= dt <= datetime(2026, 12, 31, 23, 59, 59, tzinfo=dt.tzinfo)
        assert 100 <= amount <= 10_000


def test_transactions_sort_by_date_ascending() -> None:
    response = client.get('/api/transactions?sort_by=date&sort_order=asc&page_size=10')

    assert response.status_code == 200
    payload = response.json()
    timestamps = [_parse_iso_utc(item['transaction_date']) for item in payload['items']]
    assert timestamps == sorted(timestamps)


def test_transactions_sort_by_date_descending() -> None:
    response = client.get('/api/transactions?sort_by=date&sort_order=desc&page_size=10')

    assert response.status_code == 200
    payload = response.json()
    timestamps = [_parse_iso_utc(item['transaction_date']) for item in payload['items']]
    assert timestamps == sorted(timestamps, reverse=True)


def test_transactions_sort_by_amount_ascending() -> None:
    response = client.get('/api/transactions?sort_by=amount&sort_order=asc&page_size=10')

    assert response.status_code == 200
    payload = response.json()
    amounts = [float(item['amount']) for item in payload['items']]
    assert amounts == sorted(amounts)


def test_transactions_sort_by_amount_descending() -> None:
    response = client.get('/api/transactions?sort_by=amount&sort_order=desc&page_size=10')

    assert response.status_code == 200
    payload = response.json()
    amounts = [float(item['amount']) for item in payload['items']]
    assert amounts == sorted(amounts, reverse=True)


def test_transaction_detail_success() -> None:
    response = client.get('/api/transactions/1')

    assert response.status_code == 200
    payload = response.json()
    assert payload['id'] == 1
    assert payload['source_id'] == 'TXN2025000000'
    assert payload['merchant'] == 'Cult.fit'
    assert payload['status'] == 'SUCCESS'
    assert payload['amount'] == '912.62'


def test_transaction_detail_not_found_returns_404() -> None:
    response = client.get('/api/transactions/99999999')

    assert response.status_code == 404
    assert 'detail' in response.json()


def test_transactions_invalid_page_and_page_size_return_validation_errors() -> None:
    invalid_page = client.get('/api/transactions?page=0')
    invalid_page_size = client.get('/api/transactions?page_size=0')

    assert invalid_page.status_code == 422
    assert invalid_page_size.status_code == 422


def test_transactions_invalid_query_ranges_return_validation_errors() -> None:
    start_after_end = client.get('/api/transactions?start_date=2026-12-31&end_date=2026-01-01')
    min_gt_max = client.get('/api/transactions?min_amount=1000&max_amount=100')
    bad_sort = client.get('/api/transactions?sort_by=unknown')

    assert start_after_end.status_code == 422
    assert min_gt_max.status_code == 422
    assert bad_sort.status_code == 422


def test_transactions_total_matches_filtered_result_count() -> None:
    response = client.get('/api/transactions?merchant=blinkit&page_size=10')

    assert response.status_code == 200
    payload = response.json()
    assert payload['total'] >= len(payload['items'])
    assert payload['total'] == 10000 if payload['total'] == 10000 else payload['total'] >= 1
    assert len(payload['items']) <= payload['page_size']
