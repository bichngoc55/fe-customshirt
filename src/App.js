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
import AdminPage from "./pages/adminPage/adminPage";
import TShirtDetails from "./pages/TShirtDetails/TShirtDetails";
import ShippingPage from "./pages/ShippingPage/ShippingPage";
import Message from "./pages/Message/Message";
import Confirm from "./components/OrderTab/Confirm";
import DetailedDesignPage from "./pages/DetailedDesignPage/DetailedDesignPage";
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
            {token && <Route path="/:id/profile/*" element={<UserPage />} />}
            {token && <Route path="/admin/*" element={<AdminPage />} />}
            <Route path="/design" element={<DesignPage />} />
            <Route path="/collection/:id" element={<TShirtDetails />} />

            <Route path="/checkout/:id/*" element={<ShippingPage />} />
            {token && (
              <Route path="/design/:id" element={<DetailedDesignPage />} />
            )}

            <Route path="/checkout/:id/confirmation" element={<Confirm />} />

            {token && <Route path="/message/:id" element={<Message />} />}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
