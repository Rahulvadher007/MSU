"""Tests for evidence-grounding verification."""

from app.answer_grounding import verify_answer_grounding, GroundingResult
from app.contracts import EvidenceChunk
from app.evidence_controller import detect_enumeration_question


def _make_chunk(content: str, chunk_id: str = "a0eebc99") -> EvidenceChunk:
    return EvidenceChunk(
        chunk_id=chunk_id,
        content=content,
        source_type="static",
        title="Test Document",
        section="Test Section",
        domain="test",
        dense_score=0.8,
    )


class TestRegexExtraction:
    def test_extracts_numbers(self):
        chunk = _make_chunk("The premium rate is 2% of the sum insured.")
        result = verify_answer_grounding(
            "The premium rate is 5% of the sum insured.",
            [chunk],
        )
        assert result.has_unsupported_claims is True
        assert any("5%" in c.claim_text for c in result.unsupported_claims)

    def test_extracts_dates(self):
        chunk = _make_chunk("The deadline is 31 March 2025.")
        result = verify_answer_grounding(
            "The deadline is 15 April 2025.",
            [chunk],
        )
        assert result.has_unsupported_claims is True
        assert any("15 April" in c.claim_text for c in result.unsupported_claims)

    def test_preserves_correct_numbers(self):
        chunk = _make_chunk("The premium rate is 2% of the sum insured.")
        result = verify_answer_grounding(
            "The premium rate is 2% of the sum insured.",
            [chunk],
        )
        assert result.has_unsupported_claims is False

    def test_extracts_named_entities(self):
        chunk = _make_chunk("Apply to the District Magistrate.")
        result = verify_answer_grounding(
            "Apply to the Block Development Officer.",
            [chunk],
        )
        assert result.has_unsupported_claims is True
        assert any("Block Development Officer" in c.claim_text for c in result.unsupported_claims)

    def test_no_false_positives_for_common_words(self):
        chunk = _make_chunk("The farmer must be a member of the PACS.")
        result = verify_answer_grounding(
            "The farmer must be a member of the PACS.",
            [chunk],
        )
        assert result.has_unsupported_claims is False


class TestGroundingResult:
    def test_empty_answer(self):
        result = verify_answer_grounding("", [])
        assert result.has_unsupported_claims is False

    def test_no_chunks(self):
        result = verify_answer_grounding("Some answer", [])
        # No chunks means we can't verify, but shouldn't crash
        assert isinstance(result, GroundingResult)


class TestEnumerationDetector:
    def test_types_question(self):
        assert detect_enumeration_question("What are the types of risk coverage under PMFBY?") is True

    def test_categories_question(self):
        assert detect_enumeration_question("What are the categories of loans available?") is True

    def test_eligibility_question(self):
        assert detect_enumeration_question("Who is eligible for PMFBY?") is True

    def test_requirements_question(self):
        assert detect_enumeration_question("What documents are required?") is True

    def test_benefits_question(self):
        assert detect_enumeration_question("What are the benefits of PACS membership?") is True

    def test_coverage_question(self):
        assert detect_enumeration_question("What is covered under the scheme?") is True

    def test_steps_question(self):
        assert detect_enumeration_question("What are the steps to apply?") is True

    def test_exclusions_question(self):
        assert detect_enumeration_question("What are the exclusions?") is True

    def test_normal_question(self):
        assert detect_enumeration_question("How do I apply for a loan?") is False

    def test_factual_question(self):
        assert detect_enumeration_question("What is PMFBY?") is False

    def test_hindi_enumeration(self):
        assert detect_enumeration_question("PMFBY के तहत कवरेज के प्रकार क्या हैं?") is True

    def test_gujarati_enumeration(self):
        assert detect_enumeration_question("PMFBY હેઠળ કવરેજના પ્રકારો શું છે?") is True
