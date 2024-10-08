import "./App.css";
import LandingPage from "./pages/LandingPage/landingPage";
import { NavBar } from "./components/NavBar/navBar";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/registerPage";
import LoginPage from "./pages/LoginPage/loginPage";

function App() {
  const [isAuth, setAuth] = useState(false);
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
