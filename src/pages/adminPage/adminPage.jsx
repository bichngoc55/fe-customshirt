import React from "react";
import DashBoard from "./dashBoard";
import { Routes, Route } from "react-router-dom";
import User from "./User";
import Order from "./Order";
import Voucher from "./Voucher";
import "./adminPage.css"
import { Box } from "@mui/material";
import Message from "./Message";
import Analytics from "./Analytics";
import Settings from "./Settings";
const AdminPage = () => {
  return (
    <Box sx={{ display: "flex", gap: 15 }}>
      <DashBoard />
      <Routes>
        <Route path="/" element={<Analytics />} />
        <Route path="/user" element={<User />} />
        <Route path="/order" element={<Order />} />
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/message/:userId" element={<Message />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Box>
  );
};

export default AdminPage;
