import { useEffect, useState } from "react";
import { addTransaction, getSummary, getTransactions, updateCategory } from "./api";
import AnalyticsBar from "./components/AnalyticsBar";
import TransactionFeed from "./components/TransactionFeed";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [rawText, setRawText] = useState("");

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

  async function handleCategoryChange(id, category) {
    await updateCategory(id, category);
    refresh();
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>UPI Transaction Summary</h1>
      </header>

      {summary && <AnalyticsBar categories={summary.categories} />}

      <form className="add-transaction-form" onSubmit={handleAddTransaction}>
        <input
          type="text"
          placeholder="Paste a UPI alert, e.g. Paid Rs. 250 to Zomato"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <TransactionFeed
        transactions={transactions}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}

export default App;
