import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import "./designPage.css";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import PencilIcon from "@mui/icons-material/Create";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import StarBorderIcon from "@mui/icons-material/StarBorder";
const DesignPage = () => {
  const [selectedView, setSelectedView] = useState(0);

  const handleChangeView = (event, newValue) => {
    setSelectedView(newValue);
  };
  const products = [
    { id: 1, name: "T-Shirt Front", image: "/path/to/tshirt-front.jpg" },
    { id: 2, name: "T-Shirt Back", image: "/path/to/tshirt-back.jpg" },
  ];

  const tools = [
    { name: "Drawing Pen", icon: <PencilIcon /> },
    { name: "Text", icon: <TextFieldsIcon /> },
    { name: "Fill", icon: <FormatColorFillIcon /> },
    { name: "Eraser", icon: <AutoFixNormalIcon /> },
    { name: "Line", icon: <HorizontalRuleIcon /> },
    { name: "Shape", icon: <StarBorderIcon /> },
  ];

  return (
    <Box className="design-page">
      <Box className="upper-part">
        <IconButton className="back-button">
          <ArrowBackOutlinedIcon sx={{ color: "white" }} />
        </IconButton>
        <div className="bar">
          <div className="zoom-controls">
            <IconButton className="zoom-out">
              <ZoomOutOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton className="zoom-in">
              <ZoomInOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
          <input
            type="text"
            className="design-title"
            value="Untitile"
            onChange={(e) => {
              /* Handle title change */
            }}
          />
          <div className="icons">
            <IconButton>
              <ViewInArOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton>
              <ReplayOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton>
              <RefreshOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
        <Box className="save">
          <Typography
            sx={{
              color: "white",
              fontFamily: "Montserrat",
              fontSize: "0.7rem",
              textAlign: "center",
              paddingTop: "5px",
            }}
          >
            Save
          </Typography>
          <IconButton sx={{}}>
            <SaveOutlinedIcon
              sx={{ color: "white", width: "1.5rem", height: "1.2rem" }}
            />
          </IconButton>
        </Box>
      </Box>
      <Box className="lower-part">
        <Box className="paint-tool-container">
          <Typography
            sx={{ color: "white", fontSize: "1rem" }}
            className="tools-title"
          >
            Tools
          </Typography>
          <div className="tools-divider"></div>
          {tools.map((tool, index) => (
            <div key={index} className="tool-item">
              <IconButton className="tool-button">{tool.icon}</IconButton>
              <Typography
                sx={{
                  color: "white",
                  fontSize: "0.8rem",
                  fontFamily: "Montserrat",
                  textAlign: "center",
                }}
              >
                {tool.name}
              </Typography>
            </div>
          ))}
        </Box>
        <Box className="product-container">
          <Tabs
            value={selectedView}
            onChange={handleChangeView}
            aria-label="product views"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Front" />
            <Tab label="Back" />
          </Tabs>
          {/* <Box className="product-view">
            {selectedView === 0 ? (
              <img
                src="../../assets/images/cloud3.png"
                alt="T-Shirt Front"
                className="product-image"
              />
            ) : (
              <img
                src="./../assets/images/cloud3.png"
                alt="T-Shirt Back"
                className="product-image"
              />
            )}
          </Box> */}
        </Box>
        <Box className="AI-generator-container">
          <Typography
            sx={{
              color: "white",
              fontSize: "1rem",
              marginBottom: "16px",
              fontFamily: "Montserrat",
              textAlign: "center",
            }}
            className="ai-title"
          >
            AI Generator
          </Typography>
          <div className="ai-divider"></div>
          <div className="ai-option">
            <IconButton className="ai-button">
              <InsertDriveFileOutlinedIcon sx={{ color: "#8CFFB3" }} />
            </IconButton>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.8rem",
                fontFamily: "Montserrat",
                textAlign: "center",
              }}
            >
              AI
            </Typography>
          </div>
          <div className="ai-option">
            <IconButton className="ai-button">
              <ImageOutlinedIcon sx={{ color: "#B388FF" }} />
            </IconButton>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.8rem",
                fontFamily: "Montserrat",
                textAlign: "center",
              }}
            >
              Album
            </Typography>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default DesignPage;
