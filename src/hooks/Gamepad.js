import * as React from "react";

export const useGamepad = () => {
  const [lastGamepad, setLastGamepad] = React.useState(null);
  const subscribe = (reactCallback) => {
    const callback = (e) => {
      reactCallback();
      console.error(e, "wow")
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
const GAMEPAD_POLL_INTERVAL = 1000;

// Button callback will be called with a boolean[] corresponding to the buttons
export const usePollGamepad = (buttonCallback) => {
  const gamepad = useGamepad();

  // Put in ref so we don't need to rerun the useEffect
  const buttonCallbackRef = React.useRef(buttonCallback);
  buttonCallbackRef.current = buttonCallback;

  React.useEffect(() => {
    if (!gamepad) {
      return;
    }

    let lastTimeout;
    const timerCallback = () => {
      if (gamepad.buttons.some(button => button.pressed)) {
        buttonCallback(gamepad.buttons.map(buttons => buttons.pressed))
      }
      lastTimeout = setTimeout(timerCallback, GAMEPAD_POLL_INTERVAL);
    };
    lastTimeout = setTimeout(timerCallback, GAMEPAD_POLL_INTERVAL);

    return () => {
      clearTimeout(lastTimeout);
    };
  }, [gamepad]);
};
