import "./App.css";
import LandingPage from "./pages/LandingPage/landingPage2";
import { NavBar } from "./components/NavBar/navBar";
import TermsAndCondition from "./pages/TermsAndCondition/termsAndCondition";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/registerPage";
import LoginPage from "./pages/LoginPage/loginPage";
import Footer from "./components/footer/footer";
import CollectionPage from "./pages/CollectionPage/collectionPage";
import { useSelector } from "react-redux";
import UserPage from "./pages/UserPage/userPage";
import DesignPage from "./pages/DesignPage/designPage";
import Profile from "./pages/UserPage/profilePage";
// import Contact from "./pages/UserPage/contact";
import MyDesign from "./pages/UserPage/mydesign";
import MyOrder from "./pages/UserPage/myOrder";
import AdminPage from "./pages/adminPage/adminPage";
import TShirtDetails from "./pages/TShirtDetails/TShirtDetails";
import ShippingPage from "./pages/ShippingPage/ShippingPage";
function App() {
  const { token, user } = useSelector((state) => state.auths);
  const isAdmin = user?.role === "admin";
  const id = user?._id;
  return (
    <Router>
      <div className="App">
        <NavBar user={user} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsAndCondition />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/:id/profile/*" element={<UserPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="/collection/:id" element={<TShirtDetails />} />
            <Route path="/checkout/:id/*" element={<ShippingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
