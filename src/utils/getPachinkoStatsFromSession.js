import { BALLS_WON_BUTTON, JACKPOT_BUTTON, START_BUTTON } from "./Constants";

export function getPachinkoStatsFromSession(session) {
  let totalStarts = 0,
    jackpots = 0,
    startsSinceLastJackpot = 0,
    dekaballs = 0;
  for (const action of session) {
    const { index, type } = action;
    if (type === "up" && index === JACKPOT_BUTTON) {
      startsSinceLastJackpot = 0;
    }
    if (type !== "down") {
      continue;
    }
    switch (index) {
      case JACKPOT_BUTTON:
        // Reset starts since last jackpot only once we've completed the jackpot
        // so that you can see your number of starts
        jackpots++;
        break;
      case BALLS_WON_BUTTON:
        dekaballs += 1;
        break;
      case START_BUTTON:
        totalStarts++;
        startsSinceLastJackpot++;
        break;
      default:
        break;
    }
  }
  return { totalStarts, jackpots, startsSinceLastJackpot, dekaballs };
}
