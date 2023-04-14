import * as React from "react";
import { usePollGamepad } from "./Gamepad";

// These must correspond to the buttons
const RESET_BUTTON = 0;
const JACKPOT_BUTTON = 1;
const BALLS_WON_BUTTON = 2;
const START_BUTTON = 3;

export const usePachinkoState = () => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.index) {
      case RESET_BUTTON: {
        // TODO: Save old sessions
        state = [];
        break;
      }
      case JACKPOT_BUTTON:
      case BALLS_WON_BUTTON:
      case START_BUTTON: {
        state = [...state, action];
        break;
      }
    }
    state = state.sort((a, b) => {
      return a.time - b.time;
    });
    return state;
  }, []);

  const lastButtonPressRef = React.useRef(null);
  const buttonListener = React.useCallback((buttonPresses) => {
    if (!lastButtonPressRef.current) {
      lastButtonPressRef.current = buttonPresses;
      return;
    }

    const lastButtons = lastButtonPressRef.current;
    lastButtonPressRef.current = buttonPresses;

    buttonPresses.forEach((buttonStatus, index) => {
      if (buttonStatus && !lastButtons[index]) {
        dispatch({ index, time: performance.now(), type: "down" });
      } else if (!buttonStatus && lastButtons[index]) {
        dispatch({ index, time: performance.now(), type: "up" });
      }
    });
    return;
  }, []);
  const dbgButtonStatus = usePollGamepad(buttonListener);

  const dbgSendButton = React.useCallback((index) => {
    dispatch({ index, time: performance.now(), type: "down" });
    const timeout = setTimeout(() => {
      dispatch({ index, time: performance.now(), type: "up" });
    }, 100);
    return () => clearTimeout(timeout);
  }, []);
  React.useEffect(() => {
    window.dbgSendButton = dbgSendButton;
  }, [dbgSendButton]);

  const results = React.useMemo(() => {
    let totalStarts = 0,
      jackpots = 0,
      startsSinceLastJackpot = 0,
      dekaballs = 0;
    for (const action of state) {
      const { index, type } = action;
      if (type === "up" && index === JACKPOT_BUTTON) {
        jackpots++;
      }
      if (type !== "down") {
        continue;
      }
      switch (index) {
        case JACKPOT_BUTTON:
          // Reset starts since last jackpot only once we've completed the jackpot
          // so that you can see your number of starts
          startsSinceLastJackpot = 0;
          break;
        case BALLS_WON_BUTTON:
          dekaballs += 1;
          break;
        case START_BUTTON:
          totalStarts++;
          startsSinceLastJackpot++;
          break;
      }
    }
    return { totalStarts, jackpots, startsSinceLastJackpot, dekaballs };
  }, [state]);

  const inJackpot = React.useMemo(() => {
    const filteredState = state.filter((s) => s.index === JACKPOT_BUTTON);
    if (filteredState.length === 0) {
      return false;
    }
    return filteredState[filteredState.length - 1].type === "up";
  }, [state]);

  return {
    dbgSendButton,
    dbgButtonStatus,
    state,
    ...results,
    inJackpot,
  };
};
