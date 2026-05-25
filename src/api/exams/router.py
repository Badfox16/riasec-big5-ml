from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth.deps import get_current_user
from ..db.database import get_db
from ..db.models import ExamResult, User
from .schemas import ExamCreateRequest, ExamOut

router = APIRouter(prefix="/exams", tags=["Exames"])


def _to_out(exam: ExamResult) -> ExamOut:
    return ExamOut(
        id=exam.id,
        date=exam.date.isoformat(),
        holland_code=exam.holland_code,
        riasec_scores=json.loads(exam.riasec_scores_json),
        big5={
            "extraversion":      exam.extraversion,
            "agreeableness":     exam.agreeableness,
            "conscientiousness": exam.conscientiousness,
            "neuroticism":       exam.neuroticism,
            "openness":          exam.openness,
        },
        careers=json.loads(exam.careers_json),
        courses=json.loads(exam.courses_json),
        nota=exam.nota,
        age=exam.age,
        gender=exam.gender,
        education=exam.education,
    )


@router.get("", response_model=list[ExamOut])
def list_exams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exams = (
        db.query(ExamResult)
        .filter(ExamResult.user_id == current_user.id)
        .order_by(ExamResult.date.desc())
        .all()
    )
    return [_to_out(e) for e in exams]


@router.post("", response_model=ExamOut, status_code=201)
def create_exam(
    body: ExamCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exam = ExamResult(
        user_id=current_user.id,
        holland_code=body.holland_code,
        extraversion=body.big5.extraversion,
        agreeableness=body.big5.agreeableness,
        conscientiousness=body.big5.conscientiousness,
        neuroticism=body.big5.neuroticism,
        openness=body.big5.openness,
        riasec_scores_json=json.dumps([s.model_dump() for s in body.riasec_scores]),
        careers_json=json.dumps([c.model_dump() for c in body.careers]),
        courses_json=json.dumps([c.model_dump() for c in body.courses]),
        nota=body.nota,
        age=body.age,
        gender=body.gender,
        education=body.education,
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return _to_out(exam)


@router.get("/{exam_id}", response_model=ExamOut)
def get_exam(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exam = (
        db.query(ExamResult)
        .filter(ExamResult.id == exam_id, ExamResult.user_id == current_user.id)
        .first()
    )
    if not exam:
        raise HTTPException(status_code=404, detail="Exame não encontrado.")
    return _to_out(exam)


@router.delete("/{exam_id}", status_code=204)
def delete_exam(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exam = (
        db.query(ExamResult)
        .filter(ExamResult.id == exam_id, ExamResult.user_id == current_user.id)
        .first()
    )
    if not exam:
        raise HTTPException(status_code=404, detail="Exame não encontrado.")
    db.delete(exam)
    db.commit()
