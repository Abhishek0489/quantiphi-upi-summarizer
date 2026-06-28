# UPI Transaction Summary & Categorization

A money-manager web app that parses unstructured UPI transaction alert strings, auto-categorizes them by keyword, aggregates spend per category, and flags simulated cashback rewards — styled like a digital banking statement.

## What it does

1. Paste a raw UPI alert (e.g. `Paid Rs. 250 to Zomato`) into the input box.
2. The backend parses it: direction (debit/credit), amount, and a cleaned description.
3. It's auto-categorized by keyword match (`Food & Dining`, `Travel`, `Salary`, or `Miscellaneous`).
4. If it's a debit mentioning a reward partner (Cashback, CRED, Amazon Pay, etc.), a simulated 2% reward is attached.
5. The feed and analytics bars update immediately from live backend data.
6. Any card's category can be overridden via its dropdown — this PATCHes the backend and re-fetches the summary.

## Architecture

**All business logic lives on the backend** (FastAPI): parsing, keyword categorization, cashback detection, and aggregation. The React frontend only fetches from the API and renders — the only client-side computation is progress-bar width (`value / max(categories) * 100`), which the spec explicitly allows as a presentation detail.

```
backend/
├── main.py          # FastAPI app, 4 routes, CORS
├── models.py        # Pydantic schemas
├── categorizer.py   # parser + keyword tagging + cashback detection
└── store.py         # in-memory store, reducer (aggregation), seed data

frontend/src/
├── App.jsx                       # top-level state, wiring
├── api.js                        # fetch helpers
└── components/
    ├── AnalyticsBar.jsx          # 4 progress blocks
    ├── TransactionFeed.jsx       # scrolling list
    └── TransactionCard.jsx       # card, category dropdown, savings sub-row
```

## Running it

### Backend (FastAPI)
```bash
cd backend
venv\Scripts\activate      # Windows; use `source venv/bin/activate` on macOS/Linux
uvicorn main:app --reload --port 8000
```
Runs at `http://localhost:8000`. In-memory store — seeds 6 sample transactions on every restart.

### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173` and talks to the backend at `localhost:8000`.

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/transactions` | list all transactions, newest first |
| `POST` | `/transactions` | body `{raw_text}` → parse, categorize, store |
| `PATCH` | `/transactions/{id}/category` | body `{category}` → manual override |
| `GET` | `/summary` | per-category spend totals, total credit/debit, net |
