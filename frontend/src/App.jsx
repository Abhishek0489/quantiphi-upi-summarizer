import { useEffect, useState } from "react";
import {
  addTransaction,
  deleteTransaction,
  getSummary,
  getTransactions,
  updateCategory,
} from "./api";
import AnalyticsBar from "./components/AnalyticsBar";
import BalanceStrip from "./components/BalanceStrip";
import TransactionFeed from "./components/TransactionFeed";
import "./App.css";

const QUICK_ADD_PRESETS = [
  { label: "+ Zomato ₹250", rawText: "Paid Rs. 250 to Zomato" },
  { label: "+ Uber ₹480", rawText: "Paid Rs. 480 to Uber" },
  { label: "+ Salary ₹45,000", rawText: "Credited Rs. 45000 Salary for June" },
  { label: "+ Cashback Offer", rawText: "Paid Rs. 999 to Amazon Pay Cashback offer" },
];

const DIRECTION_FILTERS = [
  { label: "All", value: "all" },
  { label: "Money In", value: "credit" },
  { label: "Money Out", value: "debit" },
];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [rawText, setRawText] = useState("");
  const [directionFilter, setDirectionFilter] = useState("all");

  async function refresh() {
    const [transactionsData, summaryData] = await Promise.all([
      getTransactions(),
      getSummary(),
    ]);
    setTransactions(transactionsData);
    setSummary(summaryData);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAddTransaction(e) {
    e.preventDefault();
    if (!rawText.trim()) return;
    await addTransaction(rawText.trim());
    setRawText("");
    refresh();
  }

  async function handleQuickAdd(presetRawText) {
    await addTransaction(presetRawText);
    refresh();
  }

  async function handleCategoryChange(id, category) {
    await updateCategory(id, category);
    refresh();
  }

  async function handleDelete(id) {
    await deleteTransaction(id);
    refresh();
  }

  const filteredTransactions =
    directionFilter === "all"
      ? transactions
      : transactions.filter((t) => t.direction === directionFilter);

  return (
    <div className="app">
      <header className="app-header">
        <h1>UPI Transaction Summary</h1>
      </header>

      {summary && <AnalyticsBar categories={summary.categories} />}

      {summary && (
        <BalanceStrip
          totalCredit={summary.total_credit}
          totalDebit={summary.total_debit}
          net={summary.net}
        />
      )}

      <form className="add-transaction-form" onSubmit={handleAddTransaction}>
        <input
          type="text"
          placeholder="Paste a UPI alert, e.g. Paid Rs. 250 to Zomato"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="quick-add-row">
        {QUICK_ADD_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="quick-add-button"
            onClick={() => handleQuickAdd(preset.rawText)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="filter-tabs">
        {DIRECTION_FILTERS.map((filterOption) => (
          <button
            key={filterOption.value}
            type="button"
            className={`filter-tab ${directionFilter === filterOption.value ? "active" : ""}`}
            onClick={() => setDirectionFilter(filterOption.value)}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      <TransactionFeed
        transactions={filteredTransactions}
        onCategoryChange={handleCategoryChange}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
