import React from "react";
import { TextField, styled } from "@mui/material";
import MyDesign from "./mydesign";
import { Routes, Route, useParams } from "react-router-dom";
import NFTCollection from "./NFTCollection";
import Profile from "./profilePage";
import SharedTabs from "./SharedTabs";
import MyOrder from "./myOrder";
// input form

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
