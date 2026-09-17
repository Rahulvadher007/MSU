"""Tests for evidence-grounding verification."""

from app.evidence_controller import detect_enumeration_question


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
