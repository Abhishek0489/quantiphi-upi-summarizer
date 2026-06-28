# PROJECT.md — UPI Transaction Summary & Categorization

> **Quantiphi Vibe Coding Round — Set D**
> Master spec + 50-minute build plan. Paste this into Claude Code and build phase-by-phase.
> **Hard deadline: 01:40 PM, 28 June.** GitHub link submitted on Unstop. Repo must be PUBLIC.

---

## 0. CONTEXT FOR CLAUDE CODE (read first)

Build an automated money-manager web app that mimics a digital banking statement page. It:
1. Parses unstructured UPI transaction alert strings.
2. Auto-categorizes them via keyword matching.
3. Aggregates per-category spend and visualizes it.
4. Detects "Cashback"/reward transactions and shows a simulated savings sub-row.

**NON-NEGOTIABLE ARCHITECTURE RULE (from the problem statement):**
> All business logic, calculations, validations, and computations live on the **server (backend)**. The frontend ONLY handles presentation and user interaction.

So: parsing, categorization, aggregation, cashback math = **backend**. React just fetches and renders.

**Stack:** FastAPI (Python) backend + Vite/React frontend. In-memory store (no DB — keep it fast).

---

## 1. ARCHITECTURE

```
project-root/
├── backend/
│   ├── main.py            # FastAPI app + routes + CORS
│   ├── models.py          # Pydantic schemas
│   ├── categorizer.py     # parser + keyword tagging + cashback detection
│   ├── store.py           # in-memory store, reducer (aggregation), seed data
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js                    # fetch helpers
│       └── components/
│           ├── AnalyticsBar.jsx      # progress blocks (top)
│           ├── TransactionFeed.jsx   # scrolling timeline
│           └── TransactionCard.jsx   # one card + dropdown + cashback sub-row
└── README.md
```

---

## 2. DATA MODEL

```
Transaction {
  id: int
  raw_text: str            # "Paid Rs. 250 to Zomato"
  description: str          # cleaned display text
  amount: float            # always positive magnitude
  direction: "debit" | "credit"
  signed_amount: float     # -250 for debit, +1200 for credit
  category: str            # Food & Dining | Travel | Salary | Miscellaneous
  auto_tagged: bool        # true if parser assigned it (not user)
  expected_savings: float | null   # simulated reward points, only for cashback debits
}

Summary {
  categories: { "Food & Dining": float, "Travel": float, "Salary": float, "Miscellaneous": float }
  total_credit: float
  total_debit: float
  net: float
}
```

---

## 3. BACKEND LOGIC SPEC

### 3a. Parser (`categorizer.py`)
Read `raw_text` and extract:
- **direction**: if text starts with / contains `Paid`, `Sent`, `Debited` → `debit`. If `Received`, `Credited` → `credit`.
- **amount**: regex for `Rs.? ?([\d,]+(\.\d+)?)` → strip commas → float.
- **signed_amount**: `-amount` for debit, `+amount` for credit.

### 3b. Keyword Tagging (the auto-categorizer)
```
CATEGORY_KEYWORDS = {
  "Food & Dining": ["zomato", "swiggy", "dominos", "kfc", "mcdonald", "restaurant", "cafe"],
  "Travel":        ["uber", "ola", "rapido", "irctc", "indigo", "makemytrip", "petrol", "fuel"],
  "Salary":        ["salary", "payroll", "credited by", "stipend"],
}
```
- Lowercase the text, check each keyword list.
- First match wins → assign that category, set `auto_tagged = true`.
- No match → `"Miscellaneous"`, `auto_tagged = true` (fallback).
- User can later override via PATCH (then `auto_tagged = false`).

### 3c. Cashback / Vibe Check (the bonus feature)
```
REWARD_PARTNERS = ["cashback", "cred", "amazon pay", "rewards", "cashpoint"]
```
- ONLY applies to **debit** (outbound) transactions.
- If `raw_text` (lowercased) contains any reward keyword:
  - `expected_savings = round(amount * 0.02, 2)`  # simulated 2% point reward
- Else `expected_savings = null`.

### 3d. Reducer (aggregation in `store.py`)
Iterate all transactions:
- `total_credit` = sum of credit amounts.
- `total_debit` = sum of debit amounts.
- `categories[cat]` = sum of **debit** amounts per category (spend). (Salary stays its own bucket as credit total — keep it shown but driven by credit sum.)
- `net = total_credit - total_debit`.
- Progress bar width % = `category_sum / max(category_sums) * 100`.

### 3e. Endpoints (`main.py`)
| Method | Route | Purpose |
|---|---|---|
| `GET`  | `/transactions` | list all (newest first) |
| `POST` | `/transactions` | body `{raw_text}` → parse, categorize, cashback, store, return it |
| `PATCH`| `/transactions/{id}/category` | body `{category}` → manual override |
| `GET`  | `/summary` | reducer output |

Enable CORS for `http://localhost:5173`.

### 3f. Seed data (so UI isn't empty in the demo/Viva)
Seed ~6 transactions on startup:
```
"Paid Rs. 250 to Zomato"
"Received Rs. 1,200 from Private Company Ltd"   # → Miscellaneous credit
"Paid Rs. 480 to Uber"
"Credited Rs. 45,000 Salary for June"
"Paid Rs. 999 to Amazon Pay Cashback offer"     # → cashback sub-row
"Paid Rs. 150 to Swiggy"
```

---

## 4. FRONTEND SPEC

- **AnalyticsBar** (top): 4 progress blocks (Food & Dining, Travel, Salary, Miscellaneous). Each = label + animated filled track + ₹ total. Width driven by `/summary`.
- **TransactionFeed**: chronological scrolling list, newest on top.
- **TransactionCard**: description, amount (red for debit, green for credit), category dropdown (changing it → PATCH → refetch summary). If `expected_savings` present → render a **green "Expected Savings: +X pts"** sub-row beneath the card.
- An input box at top to POST a new raw transaction string (lets you demo parsing live in the Viva).
- All numbers/logic come FROM the API — no client-side math beyond `%` width for bars (and even that can come from backend).

Keep styling clean: card-based, subtle shadows, color-coded amounts, rounded progress tracks. CRED/PhonePe vibe.

---

## ⏱️ 5. THE 50-MINUTE BUILD PLAN (with git checkpoints)

> Tell Claude Code to do each phase, eyeball the result, then run the commit command before moving on. **Commit early, commit often** — they verify incremental commits.

### 🟢 PHASE 0 — Setup & Scaffold · `0:00 – 0:05` (5 min)
```bash
mkdir upi-summary && cd upi-summary
git init

# backend
mkdir backend && cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install fastapi uvicorn
pip freeze > requirements.txt
cd ..

# frontend
npm create vite@latest frontend -- --template react
cd frontend && npm install && cd ..

printf "venv/\n__pycache__/\nnode_modules/\ndist/\n" > .gitignore
```
**Commit:**
```bash
git add . && git commit -m "chore: scaffold backend (FastAPI) and frontend (Vite+React)"
```
👉 **Create the empty PUBLIC GitHub repo NOW** (via GitHub web or `gh repo create upi-summary --public --source=. --remote=origin`) and:
```bash
git remote add origin https://github.com/<you>/upi-summary.git
git push -u origin main
```

---

### 🟢 PHASE 1 — Backend brain · `0:05 – 0:22` (17 min)
Prompt Claude Code: *"Implement the backend per Section 3 of PROJECT.md — models.py, categorizer.py (parser + keyword tagging + cashback), store.py (in-memory + reducer + seed data), main.py (4 routes + CORS). Then run it."*
```bash
cd backend && uvicorn main:app --reload --port 8000
```
✅ Verify: open `http://localhost:8000/transactions` and `/summary` — seed data shows, cashback txn has `expected_savings`.
**Commit:**
```bash
git add . && git commit -m "feat(backend): parser, keyword categorizer, cashback detection, reducer + seed"
git push
```

---

### 🟢 PHASE 2 — Frontend feed · `0:22 – 0:38` (16 min)
Prompt: *"Build the frontend per Section 4 — api.js, App.jsx, TransactionFeed, TransactionCard with category dropdown (PATCH on change), and the add-transaction input. Wire to backend at localhost:8000."*
```bash
cd frontend && npm run dev
```
✅ Verify: cards render, dropdown changes category, adding a raw string creates a card.
**Commit:**
```bash
git add . && git commit -m "feat(frontend): transaction feed, cards, category dropdown, add-transaction input"
git push
```

---

### 🟢 PHASE 3 — Analytics bars + cashback sub-row · `0:38 – 0:46` (8 min)
Prompt: *"Add AnalyticsBar with 4 animated progress blocks driven by /summary, and render the green Expected Savings sub-row on cards that have expected_savings."*
✅ Verify: bars fill proportionally, green savings row shows on the Amazon Pay Cashback card.
**Commit:**
```bash
git add . && git commit -m "feat: analytics progress bars + Expected Savings cashback sub-row"
git push
```

---

### 🟢 PHASE 4 — Polish, README & final push · `0:46 – 0:50` (4 min)
- Quick style pass (color-coded amounts, spacing).
- Write a short `README.md`: what it does, how to run (backend + frontend commands), architecture note ("all logic server-side").
**Final commit:**
```bash
git add . && git commit -m "docs: add README; polish UI"
git push
```
👉 **Submit the GitHub link on Unstop. Confirm repo is PUBLIC. STOP committing after 01:40 PM.**

---

## 6. VIVA PREP — know these cold (they WILL ask)
- **Parser**: regex extracts amount, `Paid`/`Received` → direction, sign applied → `signed_amount`.
- **Keyword tagging**: lowercase match against `CATEGORY_KEYWORDS`, first match wins, fallback = Miscellaneous.
- **Reducer**: single pass, splits credit vs debit, sums per category → drives bar widths.
- **Cashback**: only debits, reward keyword → `amount * 2%` simulated points → green sub-row.
- **Why server-side logic**: spec requirement; keeps frontend a thin presentation layer; logic is testable/reusable.
- **Manual override**: PATCH flips `auto_tagged` to false; re-fetch summary so bars update.

## 7. IF YOU'RE RUNNING OUT OF TIME (priority order)
1. Backend parser + categorizer + `/transactions` + `/summary` (core, must work).
2. Frontend feed + cards rendering.
3. Category dropdown.
4. Analytics bars.
5. Cashback sub-row (the "Vibe Check" bonus — nice but cut last).

> A working backend + a feed that renders beats a half-built fancy UI. Get to a committed, pushable state by every checkpoint.
