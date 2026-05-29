#[allow(lint(public_entry))]
module walproof_registry::registry {
    use std::vector;
    use sui::event;
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    const E_INVALID_DECISION: u64 = 1;
    const E_EMPTY_METADATA_HASH: u64 = 2;
    const E_EMPTY_GRANT_REF: u64 = 3;
    const E_EMPTY_MILESTONE_REF: u64 = 4;
    const E_EMPTY_PROOF_PACKET_BLOB_ID: u64 = 5;
    const E_EMPTY_PROOF_PACKET_HASH: u64 = 6;
    const E_EMPTY_PROOF_REF: u64 = 7;
    const E_EMPTY_REVIEW_PACKET_BLOB_ID: u64 = 8;
    const E_EMPTY_REVIEW_PACKET_HASH: u64 = 9;

    const STATUS_SUBMITTED: u8 = 1;
    const DECISION_APPROVED: u8 = 1;
    const DECISION_REVISION_REQUESTED: u8 = 2;
    const DECISION_REJECTED: u8 = 3;

    public struct Grant has key, store {
        id: UID,
        sponsor: address,
        builder: address,
        // SHA-256 hash of the grant metadata JSON stored off-chain.
        metadata_hash: vector<u8>,
        creator: address,
        created_at_ms: u64,
    }

    public struct MilestoneProof has key, store {
        id: UID,
        grant_ref: vector<u8>,
        milestone_ref: vector<u8>,
        sponsor: address,
        submitter: address,
        // Walrus blob ID and SHA-256 hash for the JSON Proof Packet.
        proof_packet_blob_id: vector<u8>,
        proof_packet_hash: vector<u8>,
        status: u8,
        created_at_ms: u64,
    }

    public struct Review has key, store {
        id: UID,
        proof_ref: vector<u8>,
        reviewer: address,
        decision: u8,
        // Walrus blob ID and SHA-256 hash for the Sponsor Review packet.
        review_packet_blob_id: vector<u8>,
        review_packet_hash: vector<u8>,
        created_at_ms: u64,
    }

    public struct GrantCreated has copy, drop {
        grant_id: ID,
        sponsor: address,
        builder: address,
        creator: address,
        metadata_hash: vector<u8>,
        created_at_ms: u64,
    }

    public struct ProofSubmitted has copy, drop {
        proof_id: ID,
        grant_ref: vector<u8>,
        milestone_ref: vector<u8>,
        sponsor: address,
        submitter: address,
        proof_packet_blob_id: vector<u8>,
        proof_packet_hash: vector<u8>,
        status: u8,
        created_at_ms: u64,
    }

    public struct ProofReviewed has copy, drop {
        review_id: ID,
        proof_ref: vector<u8>,
        reviewer: address,
        decision: u8,
        review_packet_blob_id: vector<u8>,
        review_packet_hash: vector<u8>,
        created_at_ms: u64,
    }

    public entry fun create_grant(
        sponsor: address,
        builder: address,
        metadata_hash: vector<u8>,
        created_at_ms: u64,
        ctx: &mut TxContext
    ) {
        assert_not_empty(&metadata_hash, E_EMPTY_METADATA_HASH);

        let id = object::new(ctx);
        let grant_id = object::uid_to_inner(&id);
        let creator = tx_context::sender(ctx);

        event::emit(GrantCreated {
            grant_id,
            sponsor,
            builder,
            creator,
            metadata_hash: metadata_hash,
            created_at_ms,
        });

        transfer::public_transfer(Grant {
            id,
            sponsor,
            builder,
            metadata_hash,
            creator,
            created_at_ms,
        }, creator);
    }

    public entry fun submit_proof(
        grant_ref: vector<u8>,
        milestone_ref: vector<u8>,
        sponsor: address,
        proof_packet_blob_id: vector<u8>,
        proof_packet_hash: vector<u8>,
        created_at_ms: u64,
        ctx: &mut TxContext
    ) {
        assert_not_empty(&grant_ref, E_EMPTY_GRANT_REF);
        assert_not_empty(&milestone_ref, E_EMPTY_MILESTONE_REF);
        assert_not_empty(&proof_packet_blob_id, E_EMPTY_PROOF_PACKET_BLOB_ID);
        assert_not_empty(&proof_packet_hash, E_EMPTY_PROOF_PACKET_HASH);

        let id = object::new(ctx);
        let proof_id = object::uid_to_inner(&id);
        let submitter = tx_context::sender(ctx);

        event::emit(ProofSubmitted {
            proof_id,
            grant_ref: grant_ref,
            milestone_ref: milestone_ref,
            sponsor,
            submitter,
            proof_packet_blob_id: proof_packet_blob_id,
            proof_packet_hash: proof_packet_hash,
            status: STATUS_SUBMITTED,
            created_at_ms,
        });

        transfer::public_transfer(MilestoneProof {
            id,
            grant_ref,
            milestone_ref,
            sponsor,
            submitter,
            proof_packet_blob_id,
            proof_packet_hash,
            status: STATUS_SUBMITTED,
            created_at_ms,
        }, submitter);
    }

    public entry fun review_proof(
        proof_ref: vector<u8>,
        decision: u8,
        review_packet_blob_id: vector<u8>,
        review_packet_hash: vector<u8>,
        created_at_ms: u64,
        ctx: &mut TxContext
    ) {
        assert_not_empty(&proof_ref, E_EMPTY_PROOF_REF);
        assert_not_empty(&review_packet_blob_id, E_EMPTY_REVIEW_PACKET_BLOB_ID);
        assert_not_empty(&review_packet_hash, E_EMPTY_REVIEW_PACKET_HASH);
        assert!(is_valid_decision(decision), E_INVALID_DECISION);

        let id = object::new(ctx);
        let review_id = object::uid_to_inner(&id);
        let reviewer = tx_context::sender(ctx);

        event::emit(ProofReviewed {
            review_id,
            proof_ref: proof_ref,
            reviewer,
            decision,
            review_packet_blob_id: review_packet_blob_id,
            review_packet_hash: review_packet_hash,
            created_at_ms,
        });

        transfer::public_transfer(Review {
            id,
            proof_ref,
            reviewer,
            decision,
            review_packet_blob_id,
            review_packet_hash,
            created_at_ms,
        }, reviewer);
    }

    fun is_valid_decision(decision: u8): bool {
        decision == DECISION_APPROVED ||
            decision == DECISION_REVISION_REQUESTED ||
            decision == DECISION_REJECTED
    }

    fun assert_not_empty(value: &vector<u8>, code: u64) {
        assert!(vector::length(value) > 0, code);
    }

    #[test_only]
    public fun test_is_valid_decision(decision: u8): bool {
        is_valid_decision(decision)
    }
}
