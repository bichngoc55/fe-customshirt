import React, { useState } from "react";
import { Typography, IconButton } from "@mui/material";
import logo from "./logo.png";
import defaultAva from "../../assets/images/no_img.jpeg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseIcon from "@mui/icons-material/Close";
import "./navBar.css";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [isLogin, setLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Our Product", path: "#" },
    { text: "Design", path: "#" },
    { text: "Terms&Conditions", path: "#" },
  ];

  return (
    <>
      <div className="container">
        <div className="name">
          <img src={logo} alt="" className="logo" />
          <div className="domdom">DOMDOM</div>
        </div>
        <div className="components desktop-menu">
          {navItems.map((item) => (
            <Typography key={item.text} onClick={() => navigate(item.path)}>
              {item.text}
            </Typography>
          ))}
        </div>
        <div className="mobile-menu">
          <IconButton onClick={toggleMenu} sx={{ color: "white" }}>
            {isMenuOpen ? <CloseIcon /> : <MenuOutlinedIcon />}
          </IconButton>
        </div>
        {isLogin === false && (
          <div className="service">
            <button className="Login" onClick={() => navigate("/login")}>
              LOGIN
            </button>
            <button className="Register" onClick={() => navigate("/register")}>
              Register
            </button>
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
      <div className={`mobile-dropdown ${isMenuOpen ? "open" : ""}`}>
        {navItems.map((item, index) => (
          <Typography
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            {item.text}
          </Typography>
        ))}
        {isLogin === false && (
          <div className="mobile-service">
            <button className="Login" onClick={() => navigate("/login")}>
              LOGIN
            </button>
            <button className="Register" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        )}
        {isLogin && (
          <div className="mobile-service">
            <SearchOutlinedIcon
              sx={{ color: "white", display: "flex", alignItems: "center" }}
            />
            <img src={defaultAva} alt="" className="ava" />
            <div className="user">USERNAME</div>
          </div>
        )}
      </div>
    </>
  );
};
