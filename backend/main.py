from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import CategoryUpdate, Summary, Transaction, TransactionCreate
from store import store

app = FastAPI(title="UPI Transaction Summary & Categorization")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/transactions", response_model=list[Transaction])
def get_transactions():
    return store.list_transactions()


@app.post("/transactions", response_model=Transaction)
def create_transaction(payload: TransactionCreate):
    return store.add_transaction(payload.raw_text)


@app.patch("/transactions/{transaction_id}/category", response_model=Transaction)
def update_transaction_category(transaction_id: int, payload: CategoryUpdate):
    transaction = store.update_category(transaction_id, payload.category)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@app.get("/summary", response_model=Summary)
def get_summary():
    return store.get_summary()


@app.delete("/transactions/{transaction_id}", response_model=Summary)
def delete_transaction(transaction_id: int):
    deleted = store.delete_transaction(transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return store.get_summary()
