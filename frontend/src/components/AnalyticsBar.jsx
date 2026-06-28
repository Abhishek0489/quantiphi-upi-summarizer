const CATEGORY_ORDER = ["Food & Dining", "Travel", "Salary", "Miscellaneous"];

function AnalyticsBar({ categories }) {
  const maxValue = Math.max(...Object.values(categories), 1);

  return (
    <div className="analytics-bar">
      {CATEGORY_ORDER.map((category) => {
        const value = categories[category] ?? 0;
        const widthPercent = (value / maxValue) * 100;

        return (
          <div className="progress-block" data-category={category} key={category}>
            <div className="progress-label">
              <span className="progress-category-name">{category}</span>
              <span>₹{value.toLocaleString("en-IN")}</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AnalyticsBar;
