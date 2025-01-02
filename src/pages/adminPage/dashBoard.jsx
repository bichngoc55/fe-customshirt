import React, { useState, useEffect } from "react";
import "./dashBoard.css";
import {
  Person as UserIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as OrderIcon,
  Email as MessageIcon,
  Settings as SettingsIcon,
  ExitToApp as SignOutIcon,
} from "@mui/icons-material";
import MenuItem from "../../components/menuItem/menuItem";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";
import { useDispatch } from 'react-redux';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import axios from "axios";

const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openSignoutDialog, setOpenSignoutDialog] = useState(false);
  const [firstUser,setFirstUser]= useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleItemClick = (item) => {
    setSelectedItem(item.key);
    navigate(item.path);
  };

  const handleSignoutClick = () => {
    setOpenSignoutDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenSignoutDialog(false);
  };

  const handleConfirmSignout = async () => {
      handleClose();
      await dispatch(logoutUser());
      navigate("/login");
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchUsers = async () => {
    try {
        const response = await axios.get("http://localhost:3005/user/");
        const users = response.data.users; 
        
        if (users.length > 0 ) {
            // navigate(`/message/${users[0]._id}`);
            setFirstUser(users[0]._id);
        }
      
       
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};
fetchUsers();
  const mainMenuItems = [
    { key: "dashboard", path: "/admin", Icon: AnalyticsIcon, label: "Dashboard", exact: true },
    { key: "user", path: "/admin/user", Icon: UserIcon, label: "User", exact: true },
    { key: "order", path: "/admin/order", Icon: OrderIcon, label: "Order", exact: true },
    { key: "voucher", path: "/admin/voucher", Icon: OrderIcon, label: "Voucher", exact: true },
    { key: "message", path: `/admin/message/${firstUser}`, Icon: MessageIcon, label: "Message", exact: false },
  ];

  const bottomMenuItems = [
    { key: "settings", path: "/admin/settings", Icon: SettingsIcon, label: "Settings", exact: true },
    { key: "signout", path: "/admin/signout", Icon: SignOutIcon, label: "Signout", exact: true },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    
    const findMatchingItem = () => {
      const allItems = [...mainMenuItems, ...bottomMenuItems];
      
      // First try to find an exact match
      const exactMatch = allItems.find(
        item => item.exact && item.path === currentPath
      );
      if (exactMatch) return exactMatch.key;
      
      // Then look for prefix matches for non-exact routes
      const prefixMatch = allItems.find(
        item => !item.exact && currentPath.startsWith(item.path)
      );
      if (prefixMatch) return prefixMatch.key;
      
      // If no match found, default to null
      return null;
    };

    const matchedKey = findMatchingItem();
    setSelectedItem(matchedKey);
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", height: "80vh", fontWeight: 700, }}>
      <div
        style={{
          width: "230px",
          backgroundColor: "#151A27",
          borderRight: "0.8px solid #24313d",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div style={{ flexGrow: 1 }}>
          {mainMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              title={item.label}
              selected={selectedItem === item.key}
              Icon={<item.Icon />}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
        <div style={{ marginTop: "auto", marginBottom: "10%" }}>
          {bottomMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              title={item.label}
              selected={selectedItem === item.key}
              Icon={<item.Icon />}
              onClick={item.key === "signout" ? handleSignoutClick : () => handleItemClick(item)}
            />
          ))}
        </div>
      </div>

      <Dialog
        open={openSignoutDialog}
        onClose={handleCloseDialog}
        aria-labelledby="signout-dialog-title"
      >
        <DialogTitle id="signout-dialog-title">Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc muốn đăng xuất không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmSignout} color="primary" autoFocus>
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashBoard;