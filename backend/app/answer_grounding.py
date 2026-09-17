"""Post-generation answer grounding verification.

Two-layer check:
1. Regex extraction (fast) — extracts numbers, dates, named entities
2. LLM verification (for complex cases) — triggered when Layer 1 finds issues
"""

from __future__ import annotations

import logging
import re
from collections.abc import Callable
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
# Requires either a % suffix or a currency prefix to avoid extracting
# bare numbers that are parts of dates (e.g., "31" in "31 March 2025").
_NUMBER_PATTERN = re.compile(
    r'(?:₹|Rs\.?|INR)\s*\d+(?:\.\d+)?(?:\s*(?:lakh|crore|million|billion))?'
    r'|\d+(?:\.\d+)?%'
    r'|\d+(?:\.\d+)?\s*(?:lakh|crore|million|billion)'
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


def _check_claims(
    answer: str,
    evidence_text: str,
    extractor: Callable[[str], list[str]],
    claim_type: str,
    evidence_chunk_ids: list[str],
    case_sensitive: bool = True,
) -> list[UnsupportedClaim]:
    """Extract claims and flag those not found in evidence text.

    Args:
        answer: The generated answer text.
        evidence_text: Concatenated evidence content.
        extractor: Function that extracts claims from text.
        claim_type: Type label for unsupported claims (e.g., "number", "date").
        evidence_chunk_ids: Chunk IDs to attach to unsupported claims.
        case_sensitive: Whether the presence check is case-sensitive.

    Returns:
        List of UnsupportedClaim for any extracted claim missing from evidence.
    """
    claims = extractor(answer)
    unsupported: list[UnsupportedClaim] = []
    for claim in claims:
        claim_stripped = claim.strip()
        if not claim_stripped:
            continue
        if case_sensitive:
            found = claim_stripped in evidence_text
        else:
            found = claim_stripped.lower() in evidence_text.lower()
        if not found:
            unsupported.append(UnsupportedClaim(
                claim_text=claim_stripped,
                claim_type=claim_type,
                evidence_chunk_ids=evidence_chunk_ids,
                reason=f"{claim_type.capitalize()} '{claim_stripped}' not found in evidence",
            ))
    return unsupported


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
    unsupported.extend(_check_claims(answer, evidence_text, _extract_numbers, "number", evidence_chunk_ids))
    unsupported.extend(_check_claims(answer, evidence_text, _extract_dates, "date", evidence_chunk_ids))
    unsupported.extend(_check_claims(answer, evidence_text, _extract_entities, "entity", evidence_chunk_ids, case_sensitive=False))
    unsupported.extend(_check_claims(answer, evidence_text, _extract_conditions, "condition", evidence_chunk_ids, case_sensitive=False))

    return GroundingResult(
        has_unsupported_claims=len(unsupported) > 0,
        unsupported_claims=unsupported,
    )
