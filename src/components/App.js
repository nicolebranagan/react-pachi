import * as React from "react";
import { usePachinkoState } from "../hooks/PachinkoDataLines";

function App() {
  const pachinkoState = usePachinkoState();
  const { dbgSendButton, state, dbgButtonStatus, inJackpot, ...rest } =
    pachinkoState;

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

  const jackpotClass = inJackpot ? "jackpot" : "no-jackpot";

  return (
    <div className={`wrapper ${jackpotClass}`}>
      <div className="border border-top" />
      <div className={`main-body ${jackpotClass}`}></div>
      <div className="border border-bottom" />
    </div>
  );
}

export default App;
