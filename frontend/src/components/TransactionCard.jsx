const CATEGORY_OPTIONS = ["Food & Dining", "Travel", "Salary", "Miscellaneous"];

function TransactionCard({ transaction, onCategoryChange }) {
  const isDebit = transaction.direction === "debit";
  const amountLabel = `${isDebit ? "-" : "+"}₹${transaction.amount.toLocaleString("en-IN")}`;

  return (
    <div className="transaction-card">
      <div className="transaction-row">
        <div className="transaction-info">
          <p className="transaction-description">{transaction.description}</p>
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
