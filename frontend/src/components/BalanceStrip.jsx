function BalanceStrip({ totalCredit, totalDebit, net }) {
  return (
    <div className="balance-strip">
      <div className="balance-item">
        <span className="balance-label">Total In</span>
        <span className="balance-value credit">+₹{totalCredit.toLocaleString("en-IN")}</span>
      </div>
      <div className="balance-item">
        <span className="balance-label">Total Out</span>
        <span className="balance-value debit">-₹{totalDebit.toLocaleString("en-IN")}</span>
      </div>
      <div className="balance-item">
        <span className="balance-label">Net</span>
        <span className={`balance-value ${net >= 0 ? "credit" : "debit"}`}>
          {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

export default BalanceStrip;
