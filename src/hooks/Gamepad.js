import * as React from "react";

export const useGamepad = () => {
  const [lastGamepad, setLastGamepad] = React.useState(null);
  const subscribe = (reactCallback) => {
    const callback = (e) => {
      reactCallback();
      setLastGamepad(navigator.getGamepads()[e.gamepad.index]);
    };
    window.addEventListener("gamepadconnected", callback);
    return () => window.removeEventListener("gamepadconnected", callback);
  };

  return React.useSyncExternalStore(
    subscribe,
    () => lastGamepad,
    () => null
  );
};

// gamepad poll interval in milliseconds
const GAMEPAD_POLL_INTERVAL = 100;

// Button callback will be called with a boolean[] corresponding to the buttons
export const usePollGamepad = (buttonCallback) => {
  const gamepad = useGamepad();
  const [dbgButtonStatus, setDbgButtonStatus] = React.useState([]);

  // Put in ref so we don't need to rerun the useEffect
  const buttonCallbackRef = React.useRef(buttonCallback);
  buttonCallbackRef.current = buttonCallback;

  React.useEffect(() => {
    if (!gamepad) {
      return;
    }

    let lastTimeout;
    const timerCallback = () => {
      buttonCallbackRef.current(
        gamepad.buttons.map((buttons) => buttons.pressed)
      );
      setDbgButtonStatus(gamepad.buttons.map((buttons) => buttons.pressed));
      lastTimeout = setTimeout(timerCallback, GAMEPAD_POLL_INTERVAL);
    };
    lastTimeout = setTimeout(timerCallback, GAMEPAD_POLL_INTERVAL);

    return () => {
      clearTimeout(lastTimeout);
    };
  }, [gamepad]);
  return dbgButtonStatus;
};
