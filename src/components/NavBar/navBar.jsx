import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import logo from "./logo.png";
import defaultAva from "../../assets/images/no_img.jpeg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./navBar.css";
// import '../../../public/images/logo.png'
export const NavBar = () => {
  const [isLogin, setLogin] = useState(false);

  return (
    <div className="container">
      <div className="name">
        <img src={logo} alt="" className="logo" />
        <div className="domdom">DOMDOM</div>
      </div>
      <div className="components">
        <Typography>Home</Typography>
        <Typography>Our Product</Typography>
        <Typography>Design</Typography>
        <Typography>Terms&Conditions</Typography>
      </div>
      {isLogin === false && (
        <div className="service">
          <button className="Login">LOGIN</button>
          <button className="Register">Register</button>
        </div>
      )}
      {isLogin && (
        <div className="service">
          <SearchOutlinedIcon sx={{ color: "white" }} />
          <img src={defaultAva} alt="" className="ava" />
          <div className="user">USERNAME</div>
        </div>
      )}
    </div>
  );
};
