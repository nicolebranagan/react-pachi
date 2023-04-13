import { usePachinkoState } from "../hooks/PachinkoDataLines";

function App() {
  const pachinkoState = usePachinkoState();

  return <div className="App">{JSON.stringify(pachinkoState)}</div>;
}

export default App;
