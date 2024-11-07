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
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  MenuItem,
  styled,
  Select,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
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
import { SketchPicker } from "react-color";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
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
const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
};
const DesignPage = () => {
  const [selectedView, setSelectedView] = useState(0);
  const [isOpen3Dview, setIsOpen3Dview] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isWhiteModel, setIsWhiteModel] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const colors = ["white", "black"];
  const [drawingTool, setDrawingTool] = useState("Pencil");
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);
  const [drawColor, setDrawColor] = useState("#000000");
  const [shapeType, setShapeType] = useState("rectangle");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState("white");
  const [pencilWidth, setPencilWidth] = useState(3);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [shapeWidth, setShapeWidth] = useState(5);
  const [shapeSize, setShapeSize] = useState(100);
  const [shapeRotation, setShapeRotation] = useState(0);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activeShape, setActiveShape] = useState(null);
  const canvasInitializedRef = useRef(false);

  const generateImage = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.KEY}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
          }),
        }
      );
      // console.log(`Bearer ${KEY}`);
      console.log(response);

      const data = await response.json();
      if (data.data && data.data[0].url) {
        setGeneratedImage(data.data[0].url);
        // Add the generated image to stickers
        setStickers([
          ...stickers,
          {
            id: Date.now(),
            image: data.data[0].url,
            x: 0,
            y: 0,
          },
        ]);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleToolChange = (tool) => {
    setDrawingTool(tool);
  };

  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColors(value);
  };

  const handleAIButtonClick = () => {
    setIsAIModalOpen(true);
  };
  const handleChangeView = (event, newValue) => {
    setSelectedView(newValue);
  };

  const tools = [
    { name: "Pencil", icon: <PencilIcon /> },
    { name: "Text", icon: <TextFieldsIcon /> },
    { name: "Position", icon: <ControlCameraIcon /> },

    { name: "Eraser", icon: <AutoFixNormalIcon /> },
    { name: "Line", icon: <HorizontalRuleIcon /> },
    { name: "Shape", icon: <StarBorderIcon /> },
  ];
  //sticker

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
  // draw
  useEffect(() => {
    // Initialize canvas only once
    if (!canvasInitializedRef.current && canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 550,
        height: 550,
      });
      setCanvas(initCanvas);
      canvasInitializedRef.current = true;

      // Return cleanup function
      return () => {
        initCanvas.dispose();
        canvasInitializedRef.current = false;
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      // Load the t-shirt image as background
      fabric.Image.fromURL(
        selectedColors === "white"
          ? selectedView === 0
            ? require("../../assets/images/whiteShirtFront.png")
            : require("../../assets/images/whiteShirtBack.png")
          : selectedView === 0
          ? require("../../assets/images/blackShirtFront.png")
          : require("../../assets/images/blackShirtBack.png"),
        (img) => {
          img.scaleToWidth(550);
          img.scaleToHeight(550);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        }
      );
    }
  }, [canvas, selectedColors, selectedView]);
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
      startDrawing(); // Initialize the current tool settings
    }
  }, [canvas, drawingTool, drawColor, pencilWidth, eraserWidth]);
  // useEffect(() => {
  //   if (canvas) {
  //     canvas.on("mouse:down", startDrawing);
  //     canvas.on("mouse:up", stopDrawing);
  //     canvas.on("selection:created", (e) => setActiveShape(e.target));
  //     canvas.on("selection:updated", (e) => setActiveShape(e.target));
  //     canvas.on("selection:cleared", () => setActiveShape(null));

  //     return () => {
  //       canvas.off("mouse:down", startDrawing);
  //       canvas.off("mouse:up", stopDrawing);
  //       canvas.off("selection:created");
  //       canvas.off("selection:updated");
  //       canvas.off("selection:cleared");
  //     };
  //   }
  // }, [canvas, drawingTool, shapeType, drawColor, pencilWidth, eraserWidth]);

  const handlePreferencesOpen = () => {
    setIsPreferencesOpen(true);
  };

  const handlePreferencesClose = () => {
    setIsPreferencesOpen(false);
  };

  const updateShapePreferences = (property, value) => {
    if (activeShape) {
      activeShape.set(property, value);
      canvas.renderAll();
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
          <Tabs
            value={selectedView}
            onChange={handleChangeView}
            aria-label="product views"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Front" />
            <Tab label="Back" />
          </Tabs>
          <Box className="product-view" style={{ position: "relative" }}>
            {/* Show shirt image */}

            <img
              id="shirt-image"
              src={
                selectedColors === "white"
                  ? selectedView === 0
                    ? require("../../assets/images/whiteShirtFront.png")
                    : require("../../assets/images/whiteShirtBack.png")
                  : selectedView === 0
                  ? require("../../assets/images/blackShirtFront.png")
                  : require("../../assets/images/blackShirtBack.png")
              }
              alt="T-Shirt"
              className="product-image"
              style={{
                width: "550px",
                height: "550px",
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
          <IconButton onClick={handlePreferencesOpen} disabled={!activeShape}>
            <SettingsIcon />
          </IconButton>
          <Dialog open={isPreferencesOpen} onClose={handlePreferencesClose}>
            <DialogTitle>Shape Preferences</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography>Size</Typography>
                <input
                  type="number"
                  value={activeShape?.width || 0}
                  onChange={(e) =>
                    updateShapePreferences("width", Number(e.target.value))
                  }
                />
                <Typography>Rotation</Typography>
                <input
                  type="number"
                  value={activeShape?.angle || 0}
                  onChange={(e) =>
                    updateShapePreferences("angle", Number(e.target.value))
                  }
                />
                <Typography>Position X</Typography>
                <input
                  type="number"
                  value={activeShape?.left || 0}
                  onChange={(e) =>
                    updateShapePreferences("left", Number(e.target.value))
                  }
                />
                <Typography>Position Y</Typography>
                <input
                  type="number"
                  value={activeShape?.top || 0}
                  onChange={(e) =>
                    updateShapePreferences("top", Number(e.target.value))
                  }
                />
              </Box>
            </DialogContent>
          </Dialog>
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
