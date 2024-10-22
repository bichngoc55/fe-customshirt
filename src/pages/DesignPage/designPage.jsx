import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  PresentationControls,
  Stage,
} from "@react-three/drei";
// import Shirt from "../../assets/Shirt";
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Modal,
  Switch,
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

//function load model
function ModelWhite(props) {
  const { scene } = useGLTF("/t_shirt.glb");
  return <primitive {...props} object={scene} scale={0.005} />;
}
//function load model
function ModelBlack(props) {
  const { scene } = useGLTF("/t-shirt/source/base_footb2.glb");
  return <primitive {...props} object={scene} scale={0.005} />;
}

const DesignPage = () => {
  const [selectedView, setSelectedView] = useState(0);
  const [isOpen3Dview, setIsOpen3Dview] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isWhiteModel, setIsWhiteModel] = useState(true);

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
  //sticker
  // Fetch stickers from AI API
  const fetchStickersFromAI = async () => {
    try {
      const response = await fetch("https://api.example.com/generate-sticker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Generate stickers for my T-shirt",
        }),
      });
      const data = await response.json();
      setStickers(data.stickers); // Assuming API returns a 'stickers' array with image URLs
    } catch (error) {
      console.error("Error fetching AI-generated stickers:", error);
    }
  };

  // Handle drag-and-drop
  const handleDragStart = (sticker) => {
    setSelectedSticker(sticker);
  };

  const handleDrop = (e) => {
    if (selectedSticker) {
      const newStickers = stickers.map((sticker) =>
        sticker.id === selectedSticker.id
          ? { ...sticker, x: e.clientX, y: e.clientY }
          : sticker
      );
      setStickers(newStickers);
      setSelectedSticker(null);
    }
  };

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
              <ViewInArOutlinedIcon
                sx={{ color: "white" }}
                onClick={() => setIsOpen3Dview(!isOpen3Dview)}
              />
              {isOpen3Dview && (
                <Modal
                  open={isOpen3Dview}
                  onClose={() => setIsOpen3Dview(false)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                  }}
                >
                  <Box
                    sx={{
                      width: "60%",
                      height: "95%",
                      bgcolor: "#111111",
                      borderRadius: "10px",
                    }}
                  >
                    <Canvas dpr={[1, 2]} shadows camera={{ fov: 50 }}>
                      <OrbitControls enableZoom={false} />

                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <PresentationControls
                        speed={1.5}
                        global
                        zoom={1.2}
                        polar={[-0.4, 0.2]}
                      >
                        <Stage environment={"studio"}>
                          {isWhiteModel ? <ModelWhite /> : <ModelBlack />}{" "}
                        </Stage>
                      </PresentationControls>
                    </Canvas>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Đen</Typography>
                      <Switch
                        checked={isWhiteModel}
                        onChange={() => setIsWhiteModel(!isWhiteModel)}
                        color="default"
                      />
                      <Typography>Trắng</Typography>
                    </Box>
                  </Box>
                </Modal>
              )}
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
