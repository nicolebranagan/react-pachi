import * as React from "react";
import { PlaySessionStore } from "../stores/PlaySessionStore";
import {
  BALLS_WON_BUTTON,
  JACKPOT_BUTTON,
  RESET_BUTTON,
  START_BUTTON,
} from "../utils/Constants";
import { getPachinkoStatsFromSession } from "../utils/getPachinkoStatsFromSession";
import { usePollGamepad } from "./Gamepad";

export const usePachinkoState = () => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.index) {
      case RESET_BUTTON: {
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

  const lastButtonPressRef = React.useRef([]);
  const buttonListener = React.useCallback(
    (buttonPresses) => {
      const lastButtons = lastButtonPressRef.current;
      lastButtonPressRef.current = buttonPresses;

      buttonPresses.forEach((buttonStatus, index) => {
        if (index === RESET_BUTTON) {
          if (buttonStatus && !lastButtons[index]) {
            // If reset is pressed, then send the reset action
            dispatch({ index, time: performance.now(), type: "down" });
            if (state.length) {
              PlaySessionStore.push(state);
            }
          }
          return;
        }

        if (buttonStatus && !lastButtons[index]) {
          dispatch({ index, time: performance.now(), type: "down" });
        } else if (!buttonStatus && lastButtons[index]) {
          dispatch({ index, time: performance.now(), type: "up" });
        }
      });
      return;
    },
    [state]
  );
  const dbgButtonStatus = usePollGamepad(buttonListener);

  const dbgSendButton = React.useCallback(
    (index) => {
      const buttons = new Array(index + 1).fill(false);
      buttons[index] = true;

      buttonListener(buttons);
      setTimeout(() => {
        buttonListener(new Array(index + 1).fill(false));
      }, 100);
    },
    [buttonListener]
  );
  React.useEffect(() => {
    window.dbgSendButton = dbgSendButton;
  }, [dbgSendButton]);

  const results = React.useMemo(
    () => getPachinkoStatsFromSession(state),
    [state]
  );

  const inJackpot = React.useMemo(() => {
    const filteredState = state.filter((s) => s.index === JACKPOT_BUTTON);
    if (filteredState.length === 0) {
      return false;
    }
    return filteredState[filteredState.length - 1].type === "up";
  }, [state]);

  const previousSessions = React.useSyncExternalStore(
    PlaySessionStore.subscribe,
    PlaySessionStore.getState,
    () => []
  );

  const previousResults = React.useMemo(
    () => previousSessions.map(getPachinkoStatsFromSession),
    [previousSessions]
  );

  return {
    dbgSendButton,
    dbgButtonStatus,
    state,
    ...results,
    inJackpot,
    previousResults,
  };
};
