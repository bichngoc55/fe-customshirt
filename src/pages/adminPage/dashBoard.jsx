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
import { Box } from "@mui/material";
const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  //   function to handle item click
  const handleItemClick = (item) => {
    setSelectedItem(item.key);
    navigate(item.path);
  };
  const mainMenuItems = [
    {
      key: "dashboard",
      path: "/admin",
      Icon: AnalyticsIcon,
      label: "Dashboard",
    },
    { key: "user", path: "/admin/user", Icon: UserIcon, label: "User" },
    { key: "order", path: "/admin/order", Icon: OrderIcon, label: "Order" },
    {
      key: "message",
      path: "/admin/message",
      Icon: MessageIcon,
      label: "Message",
    },
  ];

  const bottomMenuItems = [
    {
      key: "settings",
      path: "/admin/settings",
      Icon: SettingsIcon,
      label: "Settings",
    },
    {
      key: "signout",
      path: "/admin/signout",
      Icon: SignOutIcon,
      label: "Signout",
    },
  ];
  //   useEffect to set the selected item to the current path
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
    <Box className="dashboard">
      <div className="sidebar">
        <div className="top-menu">
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
        <div className="bottom-menu">
          {bottomMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              title={item.label}
              selected={selectedItem === item.key}
              Icon={<item.Icon />}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default DashBoard;
