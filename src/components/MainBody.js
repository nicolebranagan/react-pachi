import { BigStarts } from "./BigStarts";
import { SmallStats } from "./SmallStats";

export function MainBody(props) {
  const { jackpotClass, state } = props;
  console.error("stat", state)
  return <div className={`main-body ${jackpotClass}`}>
    <BigStarts startsSinceLastJackpot={state.startsSinceLastJackpot} />
    <SmallStats label="TOTAL" value={state.totalStarts.toString()} />
    <SmallStats label="JACKPOTS" value={state.jackpots.toString()} />
    <SmallStats label="WINNINGS" value={(state.dekaballs * 10).toString()} />
  </div>;
}
