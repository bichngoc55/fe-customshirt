import "./App.css";
import LandingPage from "./pages/LandingPage/landingPage";
import { NavBar } from "./components/NavBar/navBar";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/registerPage";
import LoginPage from "./pages/LoginPage/loginPage";
import Footer from "./components/footer/footer";

function App() {
  const [isAuth, setAuth] = useState(false);
  return (
    <Router>
    <div className="App">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
