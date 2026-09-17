"""Translate route — simple proxy for client-side translation requests."""

from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()


class TranslateRequest(BaseModel):
    texts: list[str]
    source_language: str = "en"
    target_language: str = "hi"


@router.post("/translate")
def translate(req: TranslateRequest):
    if not req.texts:
        return {"translations": []}

    from app.config import get_settings
    settings = get_settings()

    # Try Sarvam first
    try:
        from app.providers.sarvam_translator import SarvamTranslator
        translator = SarvamTranslator(settings)
        results = []
        for text in req.texts:
            translated = translator.translate(text, to=req.target_language, source=req.source_language)
            results.append(translated)
        return {"translations": results}
    except Exception:
        pass

    # Fallback: Azure Translator
    try:
        from app.providers.translator import AzureTranslator
        translator = AzureTranslator(settings)
        results = []
        for text in req.texts:
            translated = translator.translate(text, to=req.target_language, source=req.source_language)
            results.append(translated)
        return {"translations": results}
    except Exception:
        pass

    # Last resort: return originals
    return {"translations": req.texts}
