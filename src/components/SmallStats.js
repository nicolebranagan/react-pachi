export function SmallStats(props) {
  const { label, value } = props;
  return (
    <div className="small-stats">
      <label>{label}</label>
      <div className="value">{value}</div>
    </div>
  );
}
