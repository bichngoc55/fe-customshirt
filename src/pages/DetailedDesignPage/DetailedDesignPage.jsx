import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PresentationControls,
  Stage,
} from "@react-three/drei";
import AIGeneratorModal from "../../components/AIGeneratorModal";
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  MenuItem,
  styled,
  Select,
  Modal,
  Switch,
  FormControl,
  InputLabel,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import PencilIcon from "@mui/icons-material/Create";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import axios from "axios";
import "./DetailedDesignPage.css";
// new
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import { useSelector } from "react-redux";

const generator = rough.generator();

// const createElement = (id, x1, y1, x2, y2, type, options = {}) => {
//   switch (type) {
//     case "line":
//     case "rectangle":
//       const roughElement =
//         type === "line"
//           ? generator.line(x1, y1, x2, y2)
//           : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
//       return { id, x1, y1, x2, y2, type, roughElement };
//     case "pencil":
//       return { id, type, points: [{ x: x1, y: y1 }] };
//     case "text":
//       return { id, type, x1, y1, x2, y2, text: "" };
//     case "eraser":
//       return { id, type, points: [{ x: x1, y: y1 }] };
//     case "image":
//       return {
//         id,
//         type,
//         x1,
//         y1,
//         x2,
//         y2,
//         image: options.image,
//         originalFile: options.originalFile,
//       };
//     default:
//       throw new Error(`Type not recognised: ${type}`);
//   }
// };

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};
const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "image":
    case "rectangle":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;

    case "pencil":
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
        );
      });
      return betweenAnyPoint ? "inside" : null;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    case "eraser":
      const betweenEraserPoints = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 10) != null
        );
      });
      return betweenEraserPoints ? "inside" : null;

    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null;
  }
};

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

// const drawElement = (roughCanvas, context, element) => {
//   switch (element.type) {
//     case "line":
//     case "rectangle":
//       roughCanvas.draw(element.roughElement);
//       break;
//     case "pencil":
//       const stroke = getSvgPathFromStroke(getStroke(element.points));
//       context.fill(new Path2D(stroke));
//       break;
//     case "text":
//       context.textBaseline = "top";
//       context.font = "24px sans-serif";
//       context.fillText(element.text, element.x1, element.y1);
//       break;
//     case "eraser":
//       context.globalCompositeOperation = "destination-out";
//       const eraserStroke = getSvgPathFromStroke(
//         getStroke(element.points, {
//           size: 10,
//           thinning: 0.5,
//           smoothing: 0.5,
//         })
//       );
//       context.fill(new Path2D(eraserStroke));
//       context.globalCompositeOperation = "source-over";
//       break;

//     case "image":
//       context.drawImage(
//         element.image,
//         element.x1,
//         element.y1,
//         element.x2 - element.x1,
//         element.y2 - element.y1
//       );
//       break;
//     default:
//       throw new Error(`Type not recognised: ${element.type}`);
//   }
// };

const adjustmentRequired = (type) =>
  ["line", "rectangle", "text", "image"].includes(type);

const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prevKeys) => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};

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
const DetailedDesignPage = () => {
  const location = useLocation();

  const initialDesign = location.state;

  const [design, setDesign] = useState(
    initialDesign || { name: "Untitled", elements: [] }
  );
  const [designTitle, setDesignTitle] = useState(design?.name || "Untitled");
  const [isOpen3Dview, setIsOpen3Dview] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [isWhiteModel, setIsWhiteModel] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const colors = ["white", "black"];
  const [drawingTool, setDrawingTool] = useState("Pencil");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [selectedColors, setSelectedColors] = useState(
    design?.color || "white"
  );
  // cuu
  //  const [selectedColors, setSelectedColors] = useState("white");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("24px");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [eraserSize, setEraserSize] = useState(20);
  const lineWidthOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20];
  const eraserSizeOptions = [10, 20, 30, 40, 50, 60];
  const [fontFamily, setFontFamily] = useState("Arial");
  // het cuu
  const [hoveredSticker, setHoveredSticker] = useState(null);
  const { user } = useSelector((state) => state.auths);
  const [canvasBounds, setCanvasBounds] = useState({
    left: 0,
    top: 0,
    width: 550,
    height: 550,
  });
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const drawElement = (roughCanvas, context, element) => {
    switch (element.type) {
      case "line":
      case "rectangle":
        context.strokeStyle = element.strokeColor || strokeColor;
        // Set line width for rough.js elements
        if (element.strokeWidth) {
          roughCanvas.generator.defaultOptions.strokeWidth =
            element.strokeWidth;
        }
        roughCanvas.draw(element.roughElement);
        // Reset to default
        roughCanvas.generator.defaultOptions.strokeWidth = 1;
        break;
      case "pencil":
        context.beginPath();
        context.strokeStyle = element.strokeColor || strokeColor;
        context.fillStyle = element.strokeColor || strokeColor;
        context.lineWidth = element.strokeWidth || strokeWidth;
        const stroke = getSvgPathFromStroke(
          getStroke(element.points, {
            size: element.strokeWidth || strokeWidth,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
          })
        );
        context.fill(new Path2D(stroke));
        break;
      case "text":
        context.textBaseline = "top";
        context.font = `${element.fontSize || fontSize} ${
          element.fontFamily || fontFamily
        }`;
        context.fillStyle = element.strokeColor || strokeColor;
        context.fillText(element.text, element.x1, element.y1);
        break;
      case "eraser":
        context.globalCompositeOperation = "destination-out";
        context.beginPath();
        const eraserStroke = getSvgPathFromStroke(
          getStroke(element.points, {
            size: element.eraserSize || eraserSize,
            thinning: 0,
            smoothing: 0.5,
            streamline: 0.5,
          })
        );
        context.fill(new Path2D(eraserStroke));
        context.globalCompositeOperation = "source-over";
        break;
      case "image":
        context.drawImage(
          element.image,
          element.x1,
          element.y1,
          element.x2 - element.x1,
          element.y2 - element.y1
        );
        break;
      default:
        throw new Error(`Type not recognised: ${element.type}`);
    }
  };
  const createElement = (id, x1, y1, x2, y2, type) => {
    switch (type) {
      case "line":
      case "rectangle":
        const roughElement =
          type === "line"
            ? generator.line(x1, y1, x2, y2)
            : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
        return {
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          roughElement,
          strokeColor,
          strokeWidth,
        };
      case "pencil":
        return {
          id,
          type,
          points: [{ x: x1, y: y1 }],
          strokeColor,
          strokeWidth,
        };
      case "text":
        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          text: "",
          strokeColor,
          fontSize,
          fontFamily,
        };
      case "eraser":
        return {
          id,
          type,
          points: [{ x: x1, y: y1 }],
          eraserSize,
        };
      case "image":
        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          image: new Image(),
        };
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };
  const fontOptions = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Courier New", label: "Courier New" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Helvetica", label: "Helvetica" },
  ];

  const fontSizeOptions = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
  ];
  // copy
  const copyToClipboard = async (image) => {
    try {
      const response = await fetch(`data:image/png;base64,${image}`);
      const blob = await response.blob();

      const data = [new ClipboardItem({ "image/png": blob })];
      await navigator.clipboard.write(data);

      return `data:image/png;base64,${image}`;
    } catch (err) {
      console.error("Failed to copy image:", err);
      alert("Failed to copy image to clipboard.");
      return null;
    }
  };
  // generate sticker
  const generateImage = async () => {
    if (!prompt) return;
    setGeneratedImage([]);

    setIsGenerating(true);
    // console.log("Generating prompt", prompt);
    try {
      const response = await axios.post(
        "http://localhost:3005/api/generate-image",
        { prompt }
      );
      // console.log("response: " + JSON.stringify(response));

      if (response.data.success) {
        setGeneratedImage(response.data.imageBase64);
        // setStickers(response.data.imageBase64);
        const newImages = Array.isArray(response.data.imageBase64)
          ? response.data.imageBase64
          : [response.data.imageBase64];

        setStickers((prev) => [...prev, ...newImages]);
        // console.log("stickers: ", stickers);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
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
    { name: "pencil", icon: <PencilIcon /> },
    { name: "text", icon: <TextFieldsIcon /> },
    { name: "selection", icon: <ControlCameraIcon /> },
    { name: "line", icon: <HorizontalRuleIcon /> },
    { name: "eraser", icon: <AutoFixNormalIcon /> },
    { name: "rectangle", icon: <StarBorderIcon /> },
  ];

  const pasteImg = async (event) => {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter((type) =>
          type.startsWith("image/")
        );

        if (imageTypes.length > 0) {
          const blob = await clipboardItem.getType(imageTypes[0]);
          const base64Image = await blobToBase64(blob);

          const img = new Image();
          img.onload = () => {
            const id = elements.length;
            const maxWidth = canvasBounds.width * 0.5;
            const maxHeight = canvasBounds.height * 0.5;
            const scaleFactor = Math.min(
              maxWidth / img.width,
              maxHeight / img.height
            );

            const imageElement = {
              id,
              type: "image",
              x1: canvasBounds.width / 2 - (img.width * scaleFactor) / 2,
              y1: canvasBounds.height / 2 - (img.height * scaleFactor) / 2,
              x2: canvasBounds.width / 2 + (img.width * scaleFactor) / 2,
              y2: canvasBounds.height / 2 + (img.height * scaleFactor) / 2,
              image: img,
              scaleFactor,
            };

            setElements((prevElements) => [...prevElements, imageElement]);
          };
          img.src = `data:${imageTypes[0]};base64,${base64Image}`;

          break;
        }
      }
    } catch (err) {
      setSnackbarMessage("Failed to paste image from clipboard.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
  };

  const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };
  const handleDeleteImage = (
    selectedElement,
    setElements,
    setSelectedElement,
    setAction
  ) => {
    if (!selectedElement) {
      setSnackbarMessage("No image selected to delete.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    if (selectedElement.type !== "image") {
      setSnackbarMessage("Please select an image");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    setElements((prevElements) =>
      prevElements.filter((element) => element.id !== selectedElement.id)
    );
    setSelectedElement(null);
    setAction("none");
  };

  const handleAddImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const id = elements.length;
          const maxWidth = canvasBounds.width * 0.8;
          const maxHeight = canvasBounds.height * 0.8;
          const scaleFactor = Math.min(
            maxWidth / img.width,
            maxHeight / img.height
          );

          const imageElement = {
            id,
            type: "image",
            x1: canvasBounds.width / 2 - (img.width * scaleFactor) / 2,
            y1: canvasBounds.height / 2 - (img.height * scaleFactor) / 2,
            x2: canvasBounds.width / 2 + (img.width * scaleFactor) / 2,
            y2: canvasBounds.height / 2 + (img.height * scaleFactor) / 2,
            image: img,
            scaleFactor,
          };

          setElements((prevElements) => [...prevElements, imageElement]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(image);
    }
  };
  useEffect(() => {
    const shirtImage = document.getElementById("shirt-image");
    if (shirtImage) {
      const rect = shirtImage.getBoundingClientRect();
      setCanvasBounds({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [selectedColors]);

  const handleSaveDesign = async () => {
    try {
      if (!user) {
        setSnackbarMessage("Please login before save design");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      }
      const canvas = document.getElementById("canvas");
      var canvasAPI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const schemaElements = elements
        .map((element) => {
          switch (element.type) {
            case "text":
              return {
                type: "text",
                content: element.text,
                properties: {
                  font: "24px sans-serif",
                  fontSize: 24,
                  color: "black",
                  position: { x: element.x1, y: element.y1 },
                  width: element.x2 - element.x1,
                  height: element.y2 - element.y1,
                },
              };
            case "rectangle":
              return {
                type: "shape",
                content: "rectangle",
                properties: {
                  shapeType: "rectangle",
                  position: { x: element.x1, y: element.y1 },
                  width: element.x2 - element.x1,
                  height: element.y2 - element.y1,
                  color: "black",
                },
              };
            case "line":
              return {
                type: "shape",
                content: "line",
                properties: {
                  shapeType: "line",
                  position: { x: element.x1, y: element.y1 },
                  width: element.x2 - element.x1,
                  height: element.y2 - element.y1,
                  color: "black",
                },
              };
            case "pencil":
              return {
                type: "shape",
                content: "freehand",
                properties: {
                  shapeType: "pencil",
                  points: element.points,
                  color: "black",
                },
              };
            case "image":
              const canvas = document.createElement("canvas");
              canvas.width = element.x2 - element.x1;
              canvas.height = element.y2 - element.y1;
              const context = canvas.getContext("2d");
              context.drawImage(
                element.image,
                0,
                0,
                canvas.width,
                canvas.height
              );
              return {
                type: "stickers",
                content: "image",
                properties: {
                  position: { x: element.x1, y: element.y1 },
                  width: element.x2 - element.x1,
                  height: element.y2 - element.y1,
                  src: canvasAPI,
                },
              };
            default:
              return null;
          }
        })
        .filter((element) => element !== null);
      // console.log("================================elements: ", elements);

      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");

      const shirtImage = document.getElementById("shirt-image");
      tempCanvas.width = shirtImage.width;
      tempCanvas.height = shirtImage.height;

      tempContext.drawImage(
        shirtImage,
        0,
        0,
        shirtImage.width,
        shirtImage.height
      );

      const drawingCanvas = document.getElementById("canvas");
      tempContext.drawImage(drawingCanvas, 0, 0);

      const previewImage = tempCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      // console.log("================================preview: ", previewImage);

      const designPayload = {
        name: designTitle,
        creator: user?._id,
        color: selectedColors,
        canvasPreview: canvasAPI,
        elements: schemaElements,
        previewImage: previewImage,
      };
      // console.log("================================payload: ", designPayload);
      const response = await axios.patch(
        `http://localhost:3005/design/${design?._id}`,
        designPayload
      );

      if (response.data.success) {
        setSnackbarMessage("Update design successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Failed to save design. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  const convertDbElementsToCanvasElements = (dbElements) => {
    return dbElements
      .map((element, index) => {
        switch (element.type) {
          case "stickers":
            if (element.content === "image") {
              const img = new Image();
              img.src = element.properties.src;
              return {
                id: index,
                type: "image",
                x1: element.properties.position.x,
                y1: element.properties.position.y,
                x2: element.properties.position.x + element.properties.width,
                y2: element.properties.position.y + element.properties.height,
                image: img,
                originalFile: null,
                scaleFactor: 1,
              };
            }
            break;
          case "shape":
            if (element.content === "freehand") {
              return {
                id: index,
                type: "pencil",
                points: element.properties.points.map((point) => ({
                  x: point.x,
                  y: point.y,
                })),
                strokeColor: element.properties.color,
                strokeWidth: element.properties.strokeWidth,
              };
            } else if (element.content === "line") {
              return {
                id: index,
                type: "line",
                x1: element.properties.position.x,
                y1: element.properties.position.y,
                x2: element.properties.position.x + element.properties.width,
                y2: element.properties.position.y + element.properties.height,
                roughElement: generator.line(
                  element.properties.position.x,
                  element.properties.position.y,
                  element.properties.position.x + element.properties.width,
                  element.properties.position.y + element.properties.height
                ),
                strokeColor: element.properties.color,
                strokeWidth: element.properties.strokeWidth,
              };
            } else if (element.content === "rectangle") {
              return {
                id: index,
                type: "rectangle",
                x1: element.properties.position.x,
                y1: element.properties.position.y,
                x2: element.properties.position.x + element.properties.width,
                y2: element.properties.position.y + element.properties.height,
                roughElement: generator.rectangle(
                  element.properties.position.x,
                  element.properties.position.y,
                  element.properties.width,
                  element.properties.height
                ),
                strokeColor: element.properties.color,
                strokeWidth: element.properties.strokeWidth,
              };
            }
            break;
          case "text":
            return {
              id: index,
              type: "text",
              x1: element.properties.position.x,
              y1: element.properties.position.y,
              x2: element.properties.position.x + element.properties.width,
              y2: element.properties.position.y + element.properties.height,
              text: element.content,
              fontSize: element.properties.fontSize,
              fontFamily: element.properties.font.split(" ")[1],
              strokeColor: element.properties.color,
            };

          default:
            return null;
        }
      })
      .filter((element) => element !== null);
  };
  // new
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("rectangle");
  const [selectedElement, setSelectedElement] = useState(null);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = React.useState({
    x: 0,
    y: 0,
  });
  const textAreaRef = useRef();
  const pressedKeys = usePressedKeys();

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(panOffset.x, panOffset.y);
    // console.log("elements: ", elements);
    if (design && design.elements && elements?.length === 0) {
      const convertedElements = convertDbElementsToCanvasElements(
        design.elements
      );
      console.log("image :", design);

      setElements(convertedElements, true);
      // console.log("den day r", convertedElements);

      setSelectedColors(design.color);
      setDesignTitle(design.name);
    }
    // console.log("elements 2: ", elements);

    elements.forEach((element) => {
      if (action === "writing" && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
    context.restore();
  }, [elements, action, selectedElement, panOffset]);

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    const panFunction = (event) => {
      setPanOffset((prevState) => ({
        x: prevState.x - event.deltaX,
        y: prevState.y - event.deltaY,
      }));
    };

    document.addEventListener("wheel", panFunction);
    return () => {
      document.removeEventListener("wheel", panFunction);
    };
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 0);
    }
  }, [action, selectedElement]);

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
    const elementsCopy = [...elements];

    // Ensure the element exists before updating
    if (!elementsCopy[id]) {
      console.error(`Element with id ${id} not found`);
      return;
    }

    switch (type) {
      case "line":
      case "rectangle":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text || "").width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text || elementsCopy[id].text || "",
        };
        break;
      case "eraser":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case "image":
        elementsCopy[id] = {
          ...elementsCopy[id],
          x1,
          y1,
          x2,
          y2,
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;
    return { clientX, clientY };
  };

  const handleMouseDown = (event) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(event);
    if (event.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }
    if (tool === "eraser") {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        "eraser"
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setAction("drawing");
      return;
    }
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "image") {
          // console.log("Image selected: 1", element);

          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;

          setSelectedElement({
            ...element,
            offsetX,
            offsetY,
          });
          // console.log("Image selected: 2", element);
        } else if (element.type === "pencil") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      console.log("co chay vao day ko 1", element);

      setAction(tool === "text" ? "writing" : "drawing");
    }
  };
  const handleMouseMove = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      return;
    }
    if (action === "drawing" && tool === "eraser") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    }
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const options = type === "text" ? { text: selectedElement.text } : {};
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options
        );
      }
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event) => {
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
  };
  useEffect(() => {
    const pasteHandler = (event) => {
      if (
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        if (event.clipboardData && event.clipboardData.items.length > 0) {
          event.preventDefault();
          pasteImg(event);
        }
      }
    };

    const deleteHandler = (event) => {
      if (
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();

          handleDeleteImage(
            selectedElement,
            setElements,
            setSelectedElement,
            setAction
          );
        }
      }
    };

    document.addEventListener("paste", pasteHandler);
    document.addEventListener("keydown", deleteHandler);

    return () => {
      document.removeEventListener("paste", pasteHandler);
      document.removeEventListener("keydown", deleteHandler);
    };
  }, [elements, selectedElement, canvasBounds, action]);
  const StyleControls = () => {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", g: 2, marginLeft: "20px" }}
      >
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          style={{ width: 20, height: 20 }}
        />

        <StyledSelect
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          sx={{ minWidth: 120, marginLeft: "20px" }}
        >
          {fontOptions.map((font) => (
            <MenuItem key={font.value} value={font.value}>
              {font.label}
            </MenuItem>
          ))}
        </StyledSelect>

        <StyledSelect
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          sx={{ minWidth: 80, marginLeft: "20px" }}
        >
          {fontSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </StyledSelect>
        {(tool === "line" || tool === "rectangle" || tool === "pencil") && (
          <FormControl sx={{ minWidth: 120, marginLeft: "20px" }}>
            <InputLabel sx={{ color: "white" }}>Line Width</InputLabel>
            <StyledSelect
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(e.target.value)}
            >
              {lineWidthOptions.map((width) => (
                <MenuItem key={width} value={width}>
                  {width}px
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        )}

        {/* Eraser Size Control - Only show when eraser is selected */}
        {tool === "eraser" && (
          <FormControl sx={{ minWidth: 120, marginLeft: "20px" }}>
            <InputLabel sx={{ color: "white", marginLeft: "20px" }}>
              Eraser Size
            </InputLabel>
            <StyledSelect
              value={eraserSize}
              onChange={(e) => setEraserSize(e.target.value)}
            >
              {eraserSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        )}
      </Box>
    );
  };
  return (
    <Box className="design-page">
      <StyleControls />

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
            value={design.name}
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
            <IconButton onClick={undo}>
              <ReplayOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
            <IconButton onClick={redo}>
              <RefreshOutlinedIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
        <Box
          onClick={handleSaveDesign}
          className="save"
          sx={{ marginRight: "10px" }}
        >
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
                onClick={() => setTool(tool.name)}
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
        {action === "writing" ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: "fixed",
              top: selectedElement.y1 - 2 + panOffset.y,
              left: selectedElement.x1 + panOffset.x,
              font: "24px sans-serif",
              margin: 0,
              padding: 0,
              border: 0,
              outline: 0,
              resize: "auto",
              overflow: "hidden",
              whiteSpace: "pre",
              background: "transparent",
              zIndex: 2,
            }}
          />
        ) : null}
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

            <canvas
              id="canvas"
              width={canvasBounds.width}
              height={canvasBounds.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                position: "absolute",
                left: "220px",
                top: "0px",
                pointerEvents: "auto",
                zIndex: 10,
              }}
            >
              Canvas
            </canvas>
          </Box>
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
          <div
            className="ai-option"
            onClick={pasteImg}
            style={{ cursor: "pointer" }}
          >
            <IconButton className="ai-button">
              <ContentPasteIcon sx={{ color: "#8CFFB3" }} />
            </IconButton>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.8rem",
                fontFamily: "Montserrat",
                textAlign: "center",
              }}
            >
              Paste
            </Typography>
          </div>
          <div className="ai-option" style={{ cursor: "pointer" }}>
            <input
              type="file"
              accept="image/*"
              style={{ color: "#8BFFB2" }}
              onChange={handleAddImage}
            />
            {/* <Button sx={{ color: "#8BFFB2" }}>Add Image</Button> */}
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
      {stickers.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
            overflow: "auto",
            // maxHeight: "400px",
            padding: "10px",
          }}
        >
          {stickers.map((image, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                aspectRatio: "1/1",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={() => setHoveredSticker(index)}
              onMouseLeave={() => setHoveredSticker(null)}
            >
              <img
                src={`data:image/png;base64,${image}`}
                alt={`Generated Artwork ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              {hoveredSticker === index && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "8px",
                  }}
                >
                  <Tooltip title="Copy to Clipboard">
                    <IconButton
                      onClick={() => copyToClipboard(image)}
                      sx={{ color: "white" }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetailedDesignPage;
