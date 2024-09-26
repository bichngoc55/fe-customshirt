import "./App.css";
import LandingPage from "./pages/LandingPage/landingPage";
import { NavBar } from "./components/NavBar/navBar";
function App() {
  return (
    <div className="App">
      <NavBar />
      <LandingPage />
    </div>
  );
}

export default App;
