import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Badge,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MailIcon from "@mui/icons-material/Mail";
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartSidebar from "../CartSidebar/CartSidebar";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 17,
    // border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 0px",
  },
}));
export const NavBar = () => {
  const { user, token } = useSelector((state) => state.auths);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const { items } = useSelector((state) => state.cart);
  const [invisible, setInvisible] = React.useState(false);
  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };
  useEffect(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    // console.log("items :", items);
    setCartTotalItems(totalItems);
  }, [items]);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNavigateToMessage = () => {
    navigate(`/message/${user?._id}`);
  };
  const handleLogout = async () => {
    handleClose();
    await dispatch(logoutUser());
    navigate("/login");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleItemClick = (item) => {
    setSelectedItem(item.text);
    navigate(item.path);
    handleClose();
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Design", path: "/design" },
    { text: "Terms&Conditions", path: "/terms" },
    { text: "Collection", path: "/collection" },
  ];

  const dropdownItems = [
    { text: "Profile", path: `/${user?._id}/profile` },
    { text: "My Design", path: `/${user?._id}/profile/design` },
    { text: "My Order", path: `/${user?._id}/profile/order` },
    // { text: "NFT Collections", path: `/${user?._id}/profile/collection` },
  ];
  const dropdownAdminItems = [
    { text: "Dashboard", path: "/admin" },
    { text: "User", path: "/admin/user" },
    { text: "Order", path: "/admin/order" },

    { text: "Message", path: "/admin/message" },
    { text: "Voucher", path: "/admin/voucher" },
    { text: "Settings", path: "/admin/settings" },
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
            <Typography
              key={item.text}
              style={{
                cursor: "pointer",
                color: selectedItem === item.text ? "#a8dfd8" : "inherit",
              }}
              onClick={() => navigate(item.path)}
            >
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
            {/* <SearchOutlinedIcon sx={{ color: "white" }} /> */}
            <IconButton onClick={handleOpenCart} sx={{ color: "white" }}>
              <StyledBadge badgeContent={cartTotalItems} color="primary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>

            <CartSidebar
              open={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
            <Badge color="secondary" variant="dot" invisible={invisible}>
              <MailIcon
                sx={{ color: "white" }}
                onClick={handleNavigateToMessage}
              />
            </Badge>
            <Avatar src={user?.avaURL} alt="" />
            <div className="user" onClick={handleClick}>
              {user?.username}
            </div>
            {isAdmin === false && (
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
                      // backgroundColor:
                      //   selectedItem === item.text ? "#a8dfd8" : "transparent",
                    }}
                    key={item.text}
                    onClick={() => handleItemClick(item)}
                  >
                    <ListItemText primary={item.text} />
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: "text.secondary" }}
                >
                  <Box sx={{ marginRight: "6%" }}>
                    <ListItemText primary="Log out" />
                  </Box>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                </MenuItem>
              </Menu>
            )}
            {isAdmin === true && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  marginTop: "1%",
                  fontFamily: "Montserrat",
                  fontSize: "0.8rem",
                }}
              >
                {dropdownAdminItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => handleItemClick(item)}
                    // sx={{
                    //   backgroundColor:
                    //     selectedItem === item.text ? "#a8dfd8" : "transparent",
                    // }}
                  >
                    {item.text}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: "text.secondary" }}
                >
                  <Box sx={{ marginRight: "6%" }}>
                    <ListItemText primary="Log out" />
                  </Box>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                </MenuItem>
              </Menu>
            )}
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
            style={{
              transitionDelay: `${index * 50}ms`,
              // color: selectedItem === item.text ? "#a8dfd8" : "inherit",
            }}
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
              {user?.username}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
