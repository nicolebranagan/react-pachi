import * as React from "react";
import { usePachinkoState } from "../hooks/PachinkoDataLines";
import { MainBody } from "./MainBody";

function App() {
  const pachinkoState = usePachinkoState();
  const {
    dbgSendButton,
    state,
    dbgButtonStatus,
    inJackpot,
    gamepadExists,
    ...rest
  } = pachinkoState;

  if (window.location.hash === "#debug")
    return (
      <div className="App">
        {JSON.stringify(rest)}
        <div>{JSON.stringify(dbgButtonStatus)}</div>
        <div>
          {state.map((s, i) => (
            <div key={i}>{JSON.stringify(s)}</div>
          ))}
        </div>
      </div>
    );

  if (!gamepadExists) {
    return (
      <div className="wrapper no-jackpot">
        <div className="border border-top" />
        <div className="warning">
          Please attach a gamepad configured for pachinko usage, and press "RESET".
        </div>
        <div className="border border-bottom" />
      </div>
    );
  }

  const jackpotClass = inJackpot ? "jackpot" : "no-jackpot";

  return (
    <div className={`wrapper ${jackpotClass}`}>
      <div className="border border-top" />
      <MainBody
        jackpotClass={jackpotClass}
        inJackpot={inJackpot}
        state={rest}
      />
      <div className="border border-bottom" />
    </div>
  );
}

export default App;
