import React, { useState, useRef, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PresentationControls,
  Stage,
} from "@react-three/drei";
import AIGeneratorModal from "../../components/AIGeneratorModal";
import * as fabric from "fabric";
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  MenuItem,
  styled,
  Select,
  Tab,
  Modal,
  Switch,
} from "@mui/material";
import "./designPage.css";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

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
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import axios from "axios";
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
const StyledMenuItem = styled(MenuItem)(() => ({
  "&.MuiMenuItem-root": {
    color: "#1E1E1E",
    margin: "4px 8px",
    borderRadius: "4px",
    "&:first-of-type": {
      marginTop: "8px",
    },
    "&:last-of-type": {
      marginBottom: "8px",
    },
    "&:hover": {
      backgroundColor: "rgba(140, 255, 179, 0.1)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(140, 255, 179, 0.2)",
      "&:hover": {
        backgroundColor: "rgba(140, 255, 179, 0.3)",
      },
    },
  },
}));
const StyledSelect = styled(Select)(() => ({
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: "1px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(140, 255, 179, 0.5)",
    borderWidth: "1px",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiSelect-select": {
    padding: "14px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
}));
const DesignPage = () => {
  const [designTitle, setDesignTitle] = useState("Untitled");
  const [isOpen3Dview, setIsOpen3Dview] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isWhiteModel, setIsWhiteModel] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const colors = ["white", "black"];
  const [drawingTool, setDrawingTool] = useState("Pencil");
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const [drawColor, setDrawColor] = useState("#000000");
  const [shapeType, setShapeType] = useState("rectangle");
  const [selectedColors, setSelectedColors] = useState("white");
  const [pencilWidth, setPencilWidth] = useState(3);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [activeShape, setActiveShape] = useState(null);
  const canvasInitializedRef = useRef(false);
  const [history, setHistory] = useState([]);

  const saveCanvasState = () => {
    if (canvas) {
      const currentState = canvas.toJSON();
      setHistory((prevHistory) => [...prevHistory, currentState]);
    }
  };
  const undoLastAction = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setHistory((prevHistory) => prevHistory.slice(0, -1));
      });
    }
  };
  const generateImage = async () => {
    if (!prompt) return;
    setGeneratedImage([]);

    setIsGenerating(true);
    console.log("Generating prompt", prompt);
    try {
      const response = await axios.post(
        "http://localhost:3005/api/generate-image",
        { prompt }
      );
      console.log("response: " + JSON.stringify(response));

      if (response.data.success) {
        setGeneratedImage(response.data.imageBase64);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleToolChange = (tool) => {
    setDrawingTool(tool);
  };
  const handleTitleChange = (e) => {
    setDesignTitle(e.target.value);
  };

  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColors(value);
  };

  const handleAIButtonClick = () => {
    setIsAIModalOpen(true);
  };

  const tools = [
    { name: "Pencil", icon: <PencilIcon /> },
    { name: "Text", icon: <TextFieldsIcon /> },
    { name: "Position", icon: <ControlCameraIcon /> },

    { name: "Eraser", icon: <AutoFixNormalIcon /> },
    { name: "Shape", icon: <StarBorderIcon /> },
  ];

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
  useEffect(() => {
    if (!canvasInitializedRef.current && canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 550,
        height: 550,
      });
      setCanvas(initCanvas);
      canvasInitializedRef.current = true;

      return () => {
        initCanvas.dispose();
        canvasInitializedRef.current = false;
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      fabric.Image.fromURL(
        selectedColors === "white"
          ? require("../../assets/images/whiteShirtFront.png")
          : require("../../assets/images/blackShirtFront.png"),
        (img) => {
          img.scaleToWidth(550);
          img.scaleToHeight(550);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        }
      );
    }
  }, [canvas, selectedColors]);
  const addShape = (type) => {
    if (!canvas) return;

    let shape;
    const center = canvas.getCenter();

    switch (type) {
      case "rectangle":
        shape = new fabric.Rect({
          left: center.left,
          top: center.top,
          fill: drawColor,
          width: 100,
          height: 100,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          left: center.left,
          top: center.top,
          fill: drawColor,
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          left: center.left,
          top: center.top,
          fill: drawColor,
          radius: 50,
        });
        break;
      case "line":
        shape = new fabric.Line(
          [center.left, center.top, center.left + 100, center.top],
          {
            stroke: drawColor,
            strokeWidth: 5,
          }
        );
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    setActiveShape(shape);
    canvas.renderAll();
  };

  const startDrawing = () => {
    if (!canvas) return;

    switch (drawingTool) {
      case "Shape":
        addShape(shapeType);
        break;
      case "Pencil":
        if (canvas.isDrawingMode !== true) {
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.width = pencilWidth;
          canvas.freeDrawingBrush.color = drawColor;
        }
        break;
      case "Eraser":
        if (canvas.isDrawingMode !== true) {
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.width = eraserWidth;
          canvas.freeDrawingBrush.color =
            selectedColors === "white" ? "white" : "black";
        }
        break;
      default:
        canvas.isDrawingMode = false;
    }
  };

  const stopDrawing = () => {
    if (!canvas) return;
    canvas.isDrawingMode = false;
    if (canvas.isDrawingMode) {
      canvas.renderAll();
    }
  };
  useEffect(() => {
    if (canvas) {
      startDrawing();
    }
    if (canvas) {
      canvas.on("mouse:up", stopDrawing);

      return () => {
        canvas.off("mouse:up", stopDrawing);
      };
    }
  }, [canvas, drawingTool, drawColor, pencilWidth, eraserWidth]);

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
            value={designTitle}
            onChange={handleTitleChange}
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
            <IconButton onClick={undoLastAction}>
              <ReplayOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton>
              <RefreshOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
        <Box className="save" sx={{ marginRight: "10px" }}>
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
        <StyledSelect
          value={selectedColors}
          onChange={handleColorChange}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "white",
                marginTop: "8px",
                marginLeft: "10px",
                "& .MuiList-root": {
                  padding: "0",
                },
              },
            },
          }}
        >
          {colors.map((color) => (
            <StyledMenuItem key={color} value={color}>
              {color}
            </StyledMenuItem>
          ))}
        </StyledSelect>
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
              <IconButton
                onClick={() => handleToolChange(tool.name)}
                className={`tool-button ${
                  drawingTool === tool.name ? "active" : ""
                }`}
              >
                {tool.icon}
              </IconButton>
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
          <Box className="product-view" style={{ position: "relative" }}>
            <img
              id="shirt-image"
              src={
                selectedColors === "white"
                  ? require("../../assets/images/whiteShirtFront.png")
                  : require("../../assets/images/blackShirtFront.png")
              }
              alt="T-Shirt"
              className="product-image"
              style={{
                width: "550px",
                height: "550px",
                padding: "15px",
                marginLeft: "220px",
              }}
            />

            {/* Drawing Canvas */}

            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                left: "220px",
                top: "0",
                pointerEvents: "auto",
                zIndex: 10,
              }}
            />
          </Box>

          <div
            className="stickers-container"
            style={{ position: "relative", width: "100%", height: "100%" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {stickers.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.image}
                alt="Sticker"
                style={{
                  position: "absolute",
                  left: sticker.x,
                  top: sticker.y,
                  width: "100px",
                  cursor: "move",
                }}
                draggable
                onDragStart={() => handleDragStart(sticker)}
              />
            ))}
          </div>
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
          <div className="ai-option" onClick={handleAIButtonClick}>
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
          {/* <div className="ai-option">
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
          </div> */}
        </Box>
      </Box>
      <AIGeneratorModal
        isAIModalOpen={isAIModalOpen}
        setIsAIModalOpen={setIsAIModalOpen}
        isGenerating={isGenerating}
        generateImage={generateImage}
        generatedImage={generatedImage}
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </Box>
  );
};

export default DesignPage;
