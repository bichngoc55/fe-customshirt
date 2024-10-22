import React, { useState } from "react";
import {
  Tabs,
  Tab,
  TextField,
  Button,
  Avatar,
  Input,
  Box,
  styled,
} from "@mui/material";
import InputForm from "../../components/inputForm/inputForm";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import MyDesign from "./mydesign";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import NFTCollection from "./NFTCollection";
import Profile from "./profilePage";
import SharedTabs from "./SharedTabs";
import MyOrder from "./myOrder";
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

const UserProfile = () => {
  const { id } = useParams();
  return (
    <div
      style={{
        backgroundColor: "var(--background-color)",
        color: "white",
        padding: "20px",
      }}
    >
      <SharedTabs userId={id} />

      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/design" element={<MyDesign />} />
        <Route path="/order" element={<MyOrder />} />
        <Route path="/collection" element={<NFTCollection />} />
      </Routes>
    </div>
  );
};

export default UserProfile;
