#[test_only]
module walproof_registry::registry_tests {
    use walproof_registry::registry;
    use sui::test_scenario;

    const SPONSOR: address = @0xA;
    const BUILDER: address = @0xB;
    const REVIEWER: address = @0xC;

    #[test]
    fun create_grant_creates_object_and_event() {
        let mut scenario = test_scenario::begin(SPONSOR);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            registry::create_grant(SPONSOR, BUILDER, b"metadata_hash", 1000, ctx);
        };
        test_scenario::next_tx(&mut scenario, BUILDER);
        test_scenario::end(scenario);
    }

    #[test]
    fun submit_proof_creates_proof_and_event() {
        let mut scenario = test_scenario::begin(BUILDER);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            registry::submit_proof(
                b"grant_ref",
                b"milestone_ref",
                SPONSOR,
                b"walrus_blob",
                b"packet_hash",
                2000,
                ctx
            );
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun review_proof_accepts_valid_decisions() {
        let mut scenario = test_scenario::begin(REVIEWER);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            registry::review_proof(b"proof_ref", 1, b"review_blob", b"review_hash", 3000, ctx);
            registry::review_proof(b"proof_ref", 2, b"review_blob", b"review_hash", 3001, ctx);
            registry::review_proof(b"proof_ref", 3, b"review_blob", b"review_hash", 3002, ctx);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    fun review_proof_rejects_invalid_decisions() {
        let mut scenario = test_scenario::begin(REVIEWER);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            registry::review_proof(b"proof_ref", 9, b"review_blob", b"review_hash", 3000, ctx);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2)]
    fun create_grant_rejects_empty_metadata_hash() {
        let mut scenario = test_scenario::begin(SPONSOR);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            registry::create_grant(SPONSOR, BUILDER, b"", 1000, ctx);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 5)]
    fun submit_proof_rejects_empty_blob_id() {
        let mut scenario = test_scenario::begin(BUILDER);
        {
            let ctx = test_scenario::ctx(&mut scenario);
            registry::submit_proof(
                b"grant_ref",
                b"milestone_ref",
                SPONSOR,
                b"",
                b"packet_hash",
                2000,
                ctx
            );
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun decision_helper_returns_expected_values() {
        assert!(registry::test_is_valid_decision(1), 0);
        assert!(registry::test_is_valid_decision(2), 0);
        assert!(registry::test_is_valid_decision(3), 0);
        assert!(!registry::test_is_valid_decision(4), 0);
    }
}
