import * as React from "react";
import { usePollGamepad } from "./Gamepad";

// These must correspond to the buttons
const RESET_BUTTON = 0;
const JACKPOT_BUTTON = 1;
const BALLS_WON_BUTTON = 2;
const START_BUTTON = 3;

const increment = (x) => x + 1;

export const usePachinkoState = () => {
  const [totalStarts, setTotalStarts] = React.useState(0);
  const [jackpots, setJackpots] = React.useState(0);
  const [startsSinceLastJackpot, setStartsSinceLastJackpot] = React.useState(0);
  const [dekaballs, setDekaballs] = React.useState(0);

  const lastButtonPressRef = React.useRef(null);
  const buttonListener = React.useCallback((buttonPresses) => {
    if (!lastButtonPressRef.current) {
      lastButtonPressRef.current = buttonPresses;
      return;
    }

    const lastButtons = lastButtonPressRef.current;
    lastButtonPressRef.current = buttonPresses;

    // Always react when button is released, not pressed
    const buttonChanges = buttonPresses.map(
      (buttonStatus, index) => !buttonStatus && lastButtons[index]
    );
    if (buttonChanges[RESET_BUTTON]) {
      setTotalStarts(0);
      setJackpots(0);
      setStartsSinceLastJackpot(0);
      setDekaballs(0);
    }
    if (buttonChanges[JACKPOT_BUTTON]) {
      setStartsSinceLastJackpot(0);
      setJackpots(increment);
    }
    if (buttonChanges[BALLS_WON_BUTTON]) {
      setDekaballs(increment);
    }
    if (buttonChanges[START_BUTTON]) {
      setStartsSinceLastJackpot(increment);
      setTotalStarts(increment);
    }
    return;
  }, []);
  usePollGamepad(buttonListener);

  return { totalStarts, jackpots, startsSinceLastJackpot, dekaballs };
};
