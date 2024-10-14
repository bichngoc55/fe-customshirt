import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import defaultAva from "../../assets/images/no_img.jpeg";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { ListItemIcon, ListItemText } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import "./navBar.css";
import { logoutUser } from "../../redux/authSlice";

export const NavBar = () => {
  const { token } = useSelector((state) => state.auths);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = async () => {
    handleClose();
    await dispatch(logoutUser());
    navigate("/login");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Our Product", path: "#" },
    { text: "Design", path: "#" },
    { text: "Terms&Conditions", path: "/terms" },
    { text: "Collection", path: "/collection" },
  ];

  const dropdownItems = [
    { text: "Profile", path: "/profile" },
    { text: "Contact", path: "/contact" },
    { text: "My Design", path: "/my-design" },
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
        {token === null && (
          <div className="service">
            <button className="Login" onClick={() => navigate("/login")}>
              LOGIN
            </button>
            <button className="Register" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        )}
        {token && (
          <div className="service">
            <SearchOutlinedIcon sx={{ color: "white" }} />
            <img src={defaultAva} alt="" className="ava" />
            <div className="user" onClick={handleClick}>
              USERNAME
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ marginTop: "1%" }}
            >
              {dropdownItems.map((item) => (
                <MenuItem
                  sx={{
                    fontFamily: "Montserrat",
                    marginTop: "1%",
                    fontSize: "0.8rem",
                  }}
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    handleClose();
                  }}
                >
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout} sx={{ color: "text.secondary" }}>
                <Box sx={{ marginRight: "6%" }}>
                  <ListItemText primary="Log out" />
                </Box>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
            </Menu>
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
        {token === null && (
          <div className="mobile-service">
            <button className="Login" onClick={() => navigate("/login")}>
              LOGIN
            </button>
            <button className="Register" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        )}
        {token && (
          <div className="mobile-service">
            <SearchOutlinedIcon
              sx={{ color: "white", display: "flex", alignItems: "center" }}
            />
            <img src={defaultAva} alt="" className="ava" />
            <div className="user" onClick={handleClick}>
              USERNAME
            </div>
          </div>
        )}
      </div>
    </>
  );
};
