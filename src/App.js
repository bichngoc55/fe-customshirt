import "./App.css";
import LandingPage from "./pages/LandingPage/landingPage2";
import { NavBar } from "./components/NavBar/navBar";
import TermsAndCondition from "./pages/TermsAndCondition/termsAndCondition";
// import PrivateRoute from './components/PrivateRoute';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
// import Message from "./pages/Message/Message";
import Confirm from "./components/OrderTab/Confirm";
import DetailedDesignPage from "./pages/DetailedDesignPage/DetailedDesignPage";
import DesignShippingPage from "./pages/DesignShippingPage/DesignShippingPage";
import DesignConfirm from "./components/DesignOrderTab/DesignConfirm";
import DesignDeliverPage from "./components/DesignOrderTab/DesignDeliverPage";
import ShippingInfo from "./components/OrderTab/ShippingInfo";
import DesignPaymentPage from "./components/DesignOrderTab/DesignPaymentPage";
import MessageAdmin from "./pages/adminPage/Message";
import MessageCustomer from "./pages/Message/Message";
import PaymentReturn from "./components/PaymentReturn/PaymentReturn";
import { useEffect } from "react";

// const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  const { token, user } = useSelector((state) => state.auths);
  const isAdmin = user?.role === "admin";
  return (
    // <Elements stripe={stripePromise}>

    <Router>
      <ScrollToTop />
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
            <Route path="/payment-result" element={<PaymentReturn />} />

            {token && (
              <Route path="/design/:id" element={<DetailedDesignPage />} />
            )}

            <Route path="/checkout/:id/confirmation" element={<Confirm />} />
            {token && <Route path="/message/:id" element={<MessageAdmin />} />}
            {token && <Route path="/message/customer/:id" element={<MessageCustomer />} />}
            {token && <Route path="/message/:id" element={<Message />} />}
            <Route
              path="/design/payment/:id/*"
              element={<DesignShippingPage />}
            >
              <Route path="shipping" element={<ShippingInfo />} />
              <Route path="delivery" element={<DesignDeliverPage />} />
              <Route path="payment" element={<DesignPaymentPage />} />
            </Route>

            <Route
              path="/design/payment/:id/confirmation"
              element={<DesignConfirm />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    // </Elements>
  );
}

export default App;
