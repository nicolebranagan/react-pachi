import * as React from "react";
import { usePachinkoState } from "../hooks/PachinkoDataLines";

function App() {
  const pachinkoState = usePachinkoState();
  const { dbgSendButton, state, ...rest } = pachinkoState;

  return (
    <div className="App">
      {JSON.stringify(rest)}
      <div>
        {state.map((s, i) => (
          <div key={i}>{JSON.stringify(s)}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
