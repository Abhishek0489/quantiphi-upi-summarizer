from categorizer import build_transaction

CATEGORIES = ["Food & Dining", "Travel", "Salary", "Miscellaneous"]

SEED_RAW_TEXTS = [
    "Paid Rs. 250 to Zomato",
    "Received Rs. 1,200 from Private Company Ltd",
    "Paid Rs. 480 to Uber",
    "Credited Rs. 45,000 Salary for June",
    "Paid Rs. 999 to Amazon Pay Cashback offer",
    "Paid Rs. 150 to Swiggy",
]


class TransactionStore:
    """In-memory transaction ledger with seed data and summary aggregation."""

    def __init__(self) -> None:
        self._transactions: list[dict] = []
        self._next_id = 1
        for raw_text in SEED_RAW_TEXTS:
            self.add_transaction(raw_text)

    def add_transaction(self, raw_text: str) -> dict:
        transaction = build_transaction(self._next_id, raw_text)
        self._transactions.append(transaction)
        self._next_id += 1
        return transaction

    def list_transactions(self) -> list[dict]:
        return list(reversed(self._transactions))

    def update_category(self, transaction_id: int, category: str) -> dict | None:
        for transaction in self._transactions:
            if transaction["id"] == transaction_id:
                transaction["category"] = category
                transaction["auto_tagged"] = False
                return transaction
        return None

    def get_summary(self) -> dict:
        categories = {cat: 0.0 for cat in CATEGORIES}
        total_credit = 0.0
        total_debit = 0.0

        for transaction in self._transactions:
            amount = transaction["amount"]
            category = transaction["category"]
            direction = transaction["direction"]

            if direction == "credit":
                total_credit += amount
                if category == "Salary":
                    categories[category] = categories.get(category, 0.0) + amount
            else:
                total_debit += amount
                categories[category] = categories.get(category, 0.0) + amount

        return {
            "categories": {k: round(v, 2) for k, v in categories.items()},
            "total_credit": round(total_credit, 2),
            "total_debit": round(total_debit, 2),
            "net": round(total_credit - total_debit, 2),
        }


store = TransactionStore()
