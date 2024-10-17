import React from "react";
import {
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  Input,
  styled,
} from "@mui/material";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import { Routes, Route, Link } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import EditIcon from "@mui/icons-material/Edit";
import Profile from "./profilePage";
// input form
const StyledInputForm = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2d3e",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff",
    "&::placeholder": {
      color: "#6c7293",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    marginBottom: "8px",
  },
}));
// style tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "55px",
  width: "100%",
  height: "5%",
  //   maxHeight: "10px",
  //   padding: "4px",
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "#6c7293",
  fontFamily: "Montserrat",
  fontSize: "14px",
  fontWeight: "normal",
  textTransform: "none",
  width: "100%",
  //   padding: "6px 6px",
  "&.Mui-selected": {
    width: "100%",
    height: "100%",
    color: "#ffffff",
    backgroundColor: "var(--background-color)",
  },
}));

const UserProfile = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--background-color)",
        color: "white",
        padding: "20px",
      }}
    >
      <StyledTabs value={tabValue} onChange={handleTabChange} centered>
        <StyledTab label="My profile" component={Link} to="userId" />
        <StyledTab label="My design" component={Link} to="mydesign" />
        <StyledTab label="My NFT Collection" component={Link} to="nft" />
        <StyledTab label="My order state" component={Link} to="order" />
      </StyledTabs>
      {/* <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="mydesign" element={<div>My Design</div>} />
        <Route path="nft" element={<div>NFT Collection</div>} />
        <Route path="order" element={<div>Order State</div>} />
      </Routes> */}
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <Avatar
            src="/path-to-dog-image.jpg"
            alt="Gấu Tối"
            sx={{ width: 80, height: 80 }}
          />
          <h2>Gấu Toir</h2>
          <p>gautoi@gmail.com</p>
        </div>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "400px",
            margin: "20px auto",
          }}
        >
          <StyledInputForm
            label="Full Name"
            placeholder="Your full name"
            variant="outlined"
            fullWidth
          />
          <StyledInputForm
            label="Phone number"
            placeholder="Your phone number"
            variant="outlined"
            fullWidth
          />
          <StyledInputForm
            label="Current password"
            placeholder="Your current password"
            type="password"
            variant="outlined"
            fullWidth
          />
          <StyledInputForm
            label="Current Address"
            placeholder="Your current address"
            variant="outlined"
            fullWidth
          />
          <BtnComponent
            handleClick={() => {
              /* handle logout */
            }}
            width={"100%"}
            height={"40px"}
            value={"Sign Out"}
          />
        </form>
      </>
    </div>
  );
};

export default UserProfile;
