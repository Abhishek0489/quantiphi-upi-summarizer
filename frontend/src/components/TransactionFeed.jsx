import TransactionCard from "./TransactionCard";

function TransactionFeed({ transactions, onCategoryChange, onDelete }) {
  return (
    <div className="transaction-feed">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onCategoryChange={onCategoryChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TransactionFeed;
