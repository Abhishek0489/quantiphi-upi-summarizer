const CATEGORY_OPTIONS = ["Food & Dining", "Travel", "Salary", "Miscellaneous"];

function TransactionCard({ transaction, onCategoryChange, onDelete }) {
  const isDebit = transaction.direction === "debit";
  const amountLabel = `${isDebit ? "-" : "+"}₹${transaction.amount.toLocaleString("en-IN")}`;
  const timeLabel = new Date(transaction.created_at).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="transaction-card">
      <div className="transaction-row">
        <div className="transaction-info">
          <div className="transaction-heading">
            <p className="transaction-description">{transaction.description}</p>
            <span className="transaction-time">{timeLabel}</span>
          </div>
          <select
            className="category-select"
            value={transaction.category}
            onChange={(e) => onCategoryChange(transaction.id, e.target.value)}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <span className={`transaction-amount ${isDebit ? "debit" : "credit"}`}>
          {amountLabel}
        </span>
        <button
          type="button"
          className="delete-button"
          aria-label="Delete transaction"
          onClick={() => onDelete(transaction.id)}
        >
          ✕
        </button>
      </div>

      {transaction.expected_savings != null && (
        <div className="savings-row">
          Expected Savings: +{transaction.expected_savings} pts
        </div>
      )}
    </div>
  );
}

export default TransactionCard;
