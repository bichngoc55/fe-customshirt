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

const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openSignoutDialog, setOpenSignoutDialog] = useState(false);
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

  const mainMenuItems = [
    { key: "dashboard", path: "/admin", Icon: AnalyticsIcon, label: "Dashboard" },
    { key: "user", path: "/admin/user", Icon: UserIcon, label: "User" },
    { key: "order", path: "/admin/order", Icon: OrderIcon, label: "Order" },
    { key: "voucher", path: "/admin/voucher", Icon: OrderIcon, label: "Voucher" },
    { key: "message", path: "/admin/message", Icon: MessageIcon, label: "Message" },
  ];

  const bottomMenuItems = [
    { key: "settings", path: "/admin/settings", Icon: SettingsIcon, label: "Settings" },
    { key: "signout", path: "/admin/signout", Icon: SignOutIcon, label: "Signout" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = [...mainMenuItems, ...bottomMenuItems].find(
      (item) => item.path === currentPath
    );
    if (currentItem) {
      setSelectedItem(currentItem.key);
    }
  }, [location]);

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
              // sx={{
              //   fontFamily: 'Montserrat, sans-serif',
              //   fontSize: '24px',
              //   fontWeight: 600,
              //   lineHeight: '29.26px',
              //   textAlign: 'center',
              //   textUnderlinePosition: 'from-font',
              //   textDecorationSkipInk: 'none',
              // }}
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

      {/* Signout Confirmation Dialog */}
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
