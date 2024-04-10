import './App.css';
import { NavLink } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <h1>Fib Calculator</h1>
      <NavLink to={"/home"}>Home</NavLink>
      <NavLink to={"/other"}>Other</NavLink>
    </div>

  );
}
export default App;
