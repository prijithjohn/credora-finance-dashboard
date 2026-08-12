from app.seed.phase1 import audit_source_transactions, load_source_transactions


def test_dataset_audit_matches_source_snapshot() -> None:
    data = load_source_transactions()
    audit = audit_source_transactions(data)

    assert len(data) == 10_000
    assert audit['source_record_count'] == 10_000
    assert audit['duplicate_source_id_count'] == 40
    assert audit['missing_category_count'] == 200
    assert audit['normalized_status_count'] == 25
    assert audit['timestamp_normalization_failures'] == 0
    assert audit['transaction_field_count'] == 8
    assert audit['source_id_field'] == 'id'
