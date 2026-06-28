# UPGRADES.md — Bonus Features (40 min spare)

> Phase 4 done and pushed. Everything below is **bonus** — build in order, commit after each block.
> Each feature is low-risk, pure React state or a one-line backend change. **No charting libraries** (too risky in this window).

---

## ⚠️ BEFORE YOU START
Confirm Phase 4 is already committed and pushed:
```bash
git add . && git commit -m "docs: README + UI polish"
git push
```
You now have a complete, submittable product. Everything below is upside with zero downside risk.

---

## ⏱️ THE 40-MINUTE UPGRADE PLAN

### 🟡 BLOCK 1 · `0:00 – 0:08` (8 min) — Balance header + quick-add buttons
*Zero backend work. Highest demo payoff. Makes the Viva demo effortless.*

**1a. Total balance strip** — below AnalyticsBar, show:
```
Total In: ₹46,200 (green)   Total Out: ₹1,879 (red)   Net: +₹44,321
```
Pull straight from `/summary` (`total_credit`, `total_debit`, `net`). No new logic.

**1b. Preset quick-add buttons** — below the add-transaction input, 4 buttons that auto-fill + submit:
```
[+ Zomato ₹250]  [+ Uber ₹480]  [+ Salary ₹45,000]  [+ Cashback Offer]
```
Lets you demo parsing live without typing/typos.

**Commit:**
```bash
git add . && git commit -m "feat: balance summary strip + quick-add preset buttons"
git push
```

---

### 🟡 BLOCK 2 · `0:08 – 0:18` (10 min) — Delete + debit/credit filter
*Shows full CRUD + makes it feel like a real banking app.*

**2a. Delete** — Backend: `DELETE /transactions/{id}` (pop from list by id, return updated summary). Frontend: small `✕` on each card → DELETE → refetch.

**2b. Filter tabs** — above the feed: `[All] [Money In 🟢] [Money Out 🔴]`. Pure client-side filter on the `transactions` array. No backend change.

**Commit:**
```bash
git add . && git commit -m "feat: delete transaction + debit/credit filter tabs"
git push
```

---

### 🟡 BLOCK 3 · `0:18 – 0:28` (10 min) — Timestamps + toasts
*Small authentic touches that make it feel finished.*

**3a. Timestamps** — Backend: add `created_at = datetime.now().isoformat()` to the model, set on POST. Frontend: render as `"2:34 PM"` on each card.

**3b. Toast notifications** — green/red toast bottom-right for ~2.5s on add/delete, using `useState` + `setTimeout`. No library.

**Commit:**
```bash
git add . && git commit -m "feat: timestamps on cards + toast notifications"
git push
```

---

### 🟡 BLOCK 4 · `0:28 – 0:38` (10 min) — Search + category filter
*Makes the feed feel like a complete product.*

**4a. Search bar** — above the feed, real-time filter by description (client-side).

**4b. Category filter** — buttons: `[All] [Food & Dining] [Travel] [Salary] [Miscellaneous]`, combinable with the debit/credit tabs.

**Commit:**
```bash
git add . && git commit -m "feat: search bar + category filter"
git push
```

---

### 🟢 BUFFER · `0:38 – 0:40` (2 min) — Final check
- [ ] Full demo flow runs clean in a fresh browser tab
- [ ] All 4 preset buttons work
- [ ] Cashback green sub-row shows on the Amazon Pay card
- [ ] Progress bars update when a category dropdown changes
- [ ] GitHub repo is **PUBLIC**
- [ ] Skim the Viva prep section in PROJECT.md
```bash
git add . && git commit -m "chore: final check and cleanup"
git push
```

---

## 🎯 IF YOU FALL BEHIND — priority cut order
Build top-down, drop from the bottom if time runs short:
1. Balance strip (Block 1a) — free, high impact
2. Quick-add buttons (Block 1b) — makes demo smooth
3. Delete (Block 2a) — shows CRUD
4. Debit/credit filter (Block 2b)
5. Timestamps (Block 3a)
6. Toasts (Block 3b)
7. Search (Block 4a)
8. Category filter (Block 4b)

A clean working app with 2 bonus features beats a broken app with 6.

---

## 🚫 DO NOT
- Install Recharts / any chart library — not enough time to integrate cleanly.
- Add a database — your in-memory store is a deliberate, defensible choice.
- Refactor working code — if it works, leave it. Add, don't rewrite.
- Commit anything after **01:40 PM** — auto-disqualification.

---

## 💬 VIVA ANSWERS FOR THE BONUS FEATURES
- **Filters/search**: "Client-side — the API returns all transactions, filtering is a pure presentation concern so it stays in React."
- **Delete**: "DELETE endpoint mutates the store and returns the recomputed summary in one round trip."
- **Why no chart library**: "Conscious scope call for the time window — progress bars already visualize the breakdown; a chart was lower priority than a stable core."
- **Timestamps**: "Generated server-side on creation so the source of truth for time stays on the backend."
