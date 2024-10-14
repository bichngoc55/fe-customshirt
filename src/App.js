import "./App.css";
import LandingPage from "./pages/LandingPage/landingPage2";
import { NavBar } from "./components/NavBar/navBar";
import TermsAndCondition from "./pages/TermsAndCondition/termsAndCondition";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/registerPage";
import LoginPage from "./pages/LoginPage/loginPage";
import Footer from "./components/footer/footer";
import { useSelector } from "react-redux";

function App() {
  const { token } = useSelector((state) => state.auths);
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsAndCondition />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
