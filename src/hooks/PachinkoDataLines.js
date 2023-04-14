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

    // Always react when button is released, not pressed
    buttonPresses.forEach((buttonStatus, index) => {
      if (!buttonStatus && lastButtons[index]) {
        dispatch({ index, time: performance.now() });
      }
    });
    return;
  }, []);
  usePollGamepad(buttonListener);

  const dbgSendButton = React.useCallback((index) => {
    dispatch({ index, time: performance.now() });
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
      switch (action.index) {
        case JACKPOT_BUTTON:
          jackpots++;
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

  return {
    dbgSendButton,
    state,
    ...results,
  };
};
