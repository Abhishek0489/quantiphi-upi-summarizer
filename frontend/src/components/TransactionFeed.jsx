import TransactionCard from "./TransactionCard";

function TransactionFeed({ transactions, onCategoryChange }) {
  return (
    <div className="transaction-feed">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onCategoryChange={onCategoryChange}
        />
      ))}
    </div>
  );
}

export default TransactionFeed;
