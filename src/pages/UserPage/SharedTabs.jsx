import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "#151A27",
  borderRadius: "28px",
  border: "1px solid #C8FFF6",
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  padding: "10px 20px",
  fontSize: "14px",
  color: "white",
  fontFamily: "Montserrat",
  fontWeight: 500,
  textTransform: "none",
  minWidth: 0,
  transition: "background-color 0.3s",
  "&.Mui-selected": {
    backgroundColor: "#151A27",
    fontWeight: 600,
    fontSize: "15px",
    color: "#000000",
  },
  "&:hover": {
    backgroundColor: "rgba(250, 250, 250, 0.8)",
    color: "#000000",
  },
}));

const SharedTabs = ({ userId }) => {
  const location = useLocation();
  const tabRoutes = [
    { path: `/${userId}/profile`, label: "My profile" },
    { path: `/${userId}/profile/design`, label: "My design" },
    { path: `/${userId}/profile/order`, label: "My order state" },
    // { path: `/${userId}/profile/collection`, label: "NFT collection" },
  ];
  const currentTab = tabRoutes.findIndex(
    (tab) => location.pathname === tab.path
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
      <StyledTabs
        value={currentTab !== -1 ? currentTab : 0}
        variant="fullWidth"
        aria-label="user profile tabs"
        textColor="inherit"
      >
        {tabRoutes.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            component={Link}
            to={tab.path}
          />
        ))}
      </StyledTabs>
    </Box>
  );
};

export default SharedTabs;
