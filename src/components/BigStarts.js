export function BigStarts(props) {
  const { startsSinceLastJackpot } = props;
  return (
    <div className="big-starts">
      <label>STARTS</label>
      <div className="value">{startsSinceLastJackpot.toString()}</div>
    </div>
  );
}
