import re
from datetime import datetime

CATEGORY_KEYWORDS = {
    "Food & Dining": ["zomato", "swiggy", "dominos", "kfc", "mcdonald", "restaurant", "cafe"],
    "Travel": ["uber", "ola", "rapido", "irctc", "indigo", "makemytrip", "petrol", "fuel"],
    "Salary": ["salary", "payroll", "credited by", "stipend"],
}

REWARD_PARTNERS = ["cashback", "cred", "amazon pay", "rewards", "cashpoint"]

AMOUNT_PATTERN = re.compile(r"Rs\.?\s?([\d,]+(?:\.\d+)?)", re.IGNORECASE)
DEBIT_KEYWORDS = ["paid", "sent", "debited"]
CREDIT_KEYWORDS = ["received", "credited"]


def parse_transaction(raw_text: str) -> dict:
    """Extract direction, amount, and signed_amount from a raw UPI alert string."""
    lowered = raw_text.lower()

    direction = "debit" if any(k in lowered for k in DEBIT_KEYWORDS) else "credit"

    match = AMOUNT_PATTERN.search(raw_text)
    amount = float(match.group(1).replace(",", "")) if match else 0.0

    signed_amount = -amount if direction == "debit" else amount

    return {
        "direction": direction,
        "amount": amount,
        "signed_amount": signed_amount,
        "description": raw_text.strip(),
    }


def categorize(raw_text: str) -> tuple[str, bool]:
    """Lowercase keyword match against CATEGORY_KEYWORDS; first match wins, else Miscellaneous."""
    lowered = raw_text.lower()

    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in lowered for keyword in keywords):
            return category, True

    return "Miscellaneous", True


def detect_cashback(raw_text: str, direction: str, amount: float) -> float | None:
    """Simulated 2% reward on debit transactions that mention a reward partner."""
    if direction != "debit":
        return None

    lowered = raw_text.lower()
    if any(keyword in lowered for keyword in REWARD_PARTNERS):
        return round(amount * 0.02, 2)

    return None


def build_transaction(transaction_id: int, raw_text: str) -> dict:
    """Run the full parse -> categorize -> cashback pipeline for a raw alert string."""
    parsed = parse_transaction(raw_text)
    category, auto_tagged = categorize(raw_text)
    expected_savings = detect_cashback(raw_text, parsed["direction"], parsed["amount"])

    return {
        "id": transaction_id,
        "raw_text": raw_text,
        "description": parsed["description"],
        "amount": parsed["amount"],
        "direction": parsed["direction"],
        "signed_amount": parsed["signed_amount"],
        "category": category,
        "auto_tagged": auto_tagged,
        "expected_savings": expected_savings,
        "created_at": datetime.now().isoformat(),
    }
