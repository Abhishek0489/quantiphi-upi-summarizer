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

`venv/` and `node_modules/` are gitignored — on a fresh clone you need to create the venv and install dependencies before running.

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows; use `source venv/bin/activate` on macOS/Linux
pip install -r requirements.txt
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

## Manual demo walkthrough

1. **Start the backend** (first time only: create the venv and install deps, see above).
   ```powershell
   cd backend
   .\venv\Scripts\activate
   uvicorn main:app --reload --port 8000
   ```
   Leave this terminal running. Visit `http://localhost:8000/transactions` and `http://localhost:8000/summary` in a browser to confirm the 6 seed transactions and aggregates are there.

2. **Start the frontend** (in a second terminal).
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   Leave this running too, then open `http://localhost:5173`.

3. **Look at the seeded state.** Four analytics bars at the top (Food & Dining, Travel, Salary, Miscellaneous), six transaction cards below — newest first. Debit amounts are red, credit amounts are green. The "Amazon Pay Cashback offer" card has a green "Expected Savings" sub-row.

4. **Add a transaction that matches a keyword.** In the input box, type:
   ```
   Paid Rs. 75 to Domino's
   ```
   Click **Add**. A new card appears at the top, auto-tagged `Food & Dining`, and that bar grows.

5. **Add a transaction with no keyword match.** Type:
   ```
   Paid Rs. 500 to Random Store
   ```
   It falls back to `Miscellaneous`.

6. **Add a cashback transaction.** Type:
   ```
   Paid Rs. 300 to CRED Cashback
   ```
   The new card shows a green "Expected Savings: +6.0 pts" row (2% of 300).

7. **Override a category manually.** Pick any card's dropdown and change its category. The analytics bars update immediately — this is a `PATCH` to the backend followed by a re-fetch of `/summary`, proving the aggregation is recomputed server-side, not in the browser.

8. **(Optional) Hit the API directly** to show the logic is backend-owned:
   ```powershell
   curl http://localhost:8000/summary
   ```
