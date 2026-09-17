"""Post-generation answer grounding verification.

Two-layer check:
1. Regex extraction (fast) — extracts numbers, dates, named entities
2. LLM verification (for complex cases) — triggered when Layer 1 finds issues
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field

from app.contracts import EvidenceChunk

logger = logging.getLogger(__name__)


@dataclass
class UnsupportedClaim:
    """A claim in the answer that cannot be grounded in evidence."""
    claim_text: str
    claim_type: str  # "number", "date", "entity", "condition"
    evidence_chunk_ids: list[str] = field(default_factory=list)
    reason: str = ""


@dataclass
class GroundingResult:
    """Result of post-generation grounding verification."""
    has_unsupported_claims: bool = False
    unsupported_claims: list[UnsupportedClaim] = field(default_factory=list)
    all_claims: list[dict] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Regex patterns for fact extraction
# ---------------------------------------------------------------------------

# Numbers: integers, decimals, percentages, currency
_NUMBER_PATTERN = re.compile(
    r'(?:₹|Rs\.?|INR)?\s*\d+(?:\.\d+)?%?(?:\s*(?:lakh|crore|million|billion))?'
)

# Dates: DD Month YYYY, Month YYYY, DD/MM/YYYY, YYYY-MM-DD
_DATE_PATTERN = re.compile(
    r'\b(?:\d{1,2}[\s/-])?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|'
    r'May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|'
    r'Nov(?:ember)?|Dec(?:ember)?)[\s/-]?\d{0,4}\b',
    re.IGNORECASE,
)
_DATE_PATTERN_ALT = re.compile(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b')
_DATE_PATTERN_ISO = re.compile(r'\b\d{4}-\d{2}-\d{2}\b')

# Named entities: PMFBY, PACS, scheme names, authorities
_ENTITY_PATTERN = re.compile(
    r'\b(?:PMFBY|PACS|CSC|BDO|DM|SDM|DEO|DRDA|NABARD|SECC|NSFI|RBI|IRDAI|'
    r'District Magistrate|Block Development Officer|Sub-Divisional Magistrate|'
    r'District Level Evaluation Committee|State Level Evaluation Committee|'
    r'Ministry of Cooperation|Ministry of Agriculture)\b',
    re.IGNORECASE,
)

# Eligibility conditions
_CONDITION_PATTERN = re.compile(
    r'\b(?:age\s+\d+[-–]\d+\s+years?|minimum\s+\d+|maximum\s+\d+|'
    r'must be|shall be|required to be|should be)\b',
    re.IGNORECASE,
)


def _extract_numbers(text: str) -> list[str]:
    """Extract all numbers from text."""
    return _NUMBER_PATTERN.findall(text)


def _extract_dates(text: str) -> list[str]:
    """Extract all dates from text."""
    dates = _DATE_PATTERN.findall(text)
    dates.extend(_DATE_PATTERN_ALT.findall(text))
    dates.extend(_DATE_PATTERN_ISO.findall(text))
    return [d.strip() for d in dates if d.strip()]


def _extract_entities(text: str) -> list[str]:
    """Extract named entities from text."""
    return _ENTITY_PATTERN.findall(text)


def _extract_conditions(text: str) -> list[str]:
    """Extract eligibility conditions from text."""
    return _CONDITION_PATTERN.findall(text)


def _build_evidence_text(chunks: list[EvidenceChunk]) -> str:
    """Concatenate all chunk content for searching."""
    return " ".join(chunk.content for chunk in chunks)


def verify_answer_grounding(
    answer: str,
    evidence_chunks: list[EvidenceChunk],
) -> GroundingResult:
    """Verify that factual claims in the answer are grounded in evidence.

    Layer 1: Regex extraction — extracts numbers, dates, entities, conditions
    from the answer and checks if they appear in the evidence chunks.

    Returns GroundingResult with any unsupported claims found.
    """
    if not answer or not evidence_chunks:
        return GroundingResult()

    evidence_text = _build_evidence_text(evidence_chunks)
    evidence_chunk_ids = [chunk.chunk_id for chunk in evidence_chunks]
    unsupported: list[UnsupportedClaim] = []

    # Extract and verify numbers
    answer_numbers = _extract_numbers(answer)
    for num in answer_numbers:
        if num.strip() and num.strip() not in evidence_text:
            unsupported.append(UnsupportedClaim(
                claim_text=num,
                claim_type="number",
                evidence_chunk_ids=evidence_chunk_ids,
                reason=f"Number '{num}' not found in evidence",
            ))

    # Extract and verify dates
    answer_dates = _extract_dates(answer)
    for date_str in answer_dates:
        if date_str and date_str not in evidence_text:
            unsupported.append(UnsupportedClaim(
                claim_text=date_str,
                claim_type="date",
                evidence_chunk_ids=evidence_chunk_ids,
                reason=f"Date '{date_str}' not found in evidence",
            ))

    # Extract and verify named entities
    answer_entities = _extract_entities(answer)
    for entity in answer_entities:
        if entity and entity.lower() not in evidence_text.lower():
            unsupported.append(UnsupportedClaim(
                claim_text=entity,
                claim_type="entity",
                evidence_chunk_ids=evidence_chunk_ids,
                reason=f"Entity '{entity}' not found in evidence",
            ))

    # Extract and verify conditions
    answer_conditions = _extract_conditions(answer)
    for cond in answer_conditions:
        if cond and cond.lower() not in evidence_text.lower():
            unsupported.append(UnsupportedClaim(
                claim_text=cond,
                claim_type="condition",
                evidence_chunk_ids=evidence_chunk_ids,
                reason=f"Condition '{cond}' not found in evidence",
            ))

    return GroundingResult(
        has_unsupported_claims=len(unsupported) > 0,
        unsupported_claims=unsupported,
    )
