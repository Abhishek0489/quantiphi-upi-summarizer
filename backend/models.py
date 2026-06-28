from typing import Literal, Optional

from pydantic import BaseModel


class Transaction(BaseModel):
    id: int
    raw_text: str
    description: str
    amount: float
    direction: Literal["debit", "credit"]
    signed_amount: float
    category: str
    auto_tagged: bool
    expected_savings: Optional[float] = None
    created_at: str


class TransactionCreate(BaseModel):
    raw_text: str


class CategoryUpdate(BaseModel):
    category: str


class Summary(BaseModel):
    categories: dict[str, float]
    total_credit: float
    total_debit: float
    net: float
