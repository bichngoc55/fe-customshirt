import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Box, Modal, Typography, Slider, IconButton } from "@mui/material";
import { SketchPicker } from "react-color";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const DrawingCanvas = ({ activeTool, setActiveTool }) => {
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const canvasRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("drawing-canvas", {
      isDrawingMode: false,
      width: 550,
      height: 550,
      selection: true,
    });

    // Set up event listeners
    fabricCanvas.on("object:modified", function (opt) {
      // Update on object modified (resize/rotate/move)
    });

    // Position canvas over the shirt image
    const shirtImage = document.getElementById("shirt-image");
    if (shirtImage) {
      const rect = shirtImage.getBoundingClientRect();
      const canvasEl = canvasRef.current;
      if (canvasEl) {
        canvasEl.style.position = "absolute";
        canvasEl.style.left = `${rect.left}px`;
        canvasEl.style.top = `${rect.top}px`;
      }
    }

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Watch for tool changes
  useEffect(() => {
    if (!canvas) return;

    canvas.selection = activeTool === "Position"; // Only enable selection in Position mode

    switch (activeTool) {
      case "Pencil":
        handlePencilTool();
        break;
      case "Text":
        handleTextTool();
        break;
      case "Shape":
        setShowToolsModal(true);
        canvas.isDrawingMode = false;
        break;
      case "Position":
        canvas.isDrawingMode = false;
        break;
      default:
        canvas.isDrawingMode = false;
    }
  }, [activeTool, canvas]);

  // Update brush settings when color or size changes
  useEffect(() => {
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [color, brushSize, canvas]);

  const handlePencilTool = () => {
    if (!canvas) return;

    canvas.isDrawingMode = true;
    canvas.selection = false;
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;
    setShowToolsModal(true);
  };

  const handleTextTool = () => {
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    const text = new fabric.IText("Click to edit", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fill: color,
      fontSize: brushSize * 4,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setShowToolsModal(false);
  };

  const handleShapeTool = (shapeType) => {
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    let shape;
    const shapeSize = 100;

    switch (shapeType) {
      case "rectangle":
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: shapeSize,
          height: shapeSize,
          fill: color,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: shapeSize / 2,
          fill: color,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: shapeSize,
          height: shapeSize,
          fill: color,
        });
        break;
      case "ellipse":
        shape = new fabric.Ellipse({
          left: 100,
          top: 100,
          rx: shapeSize / 2,
          ry: shapeSize / 3,
          fill: color,
        });
        break;
      case "star":
        const points = [
          { x: 0, y: -50 },
          { x: 19.1, y: -15.5 },
          { x: 48.5, y: -15.5 },
          { x: 23.4, y: 5.9 },
          { x: 38.2, y: 40.5 },
          { x: 0, y: 19.1 },
          { x: -38.2, y: 40.5 },
          { x: -23.4, y: 5.9 },
          { x: -48.5, y: -15.5 },
          { x: -19.1, y: -15.5 },
        ];
        shape = new fabric.Polygon(points, {
          left: 100,
          top: 100,
          fill: color,
        });
        break;
      case "hexagon":
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          hexPoints.push({
            x: (shapeSize / 2) * Math.cos(angle),
            y: (shapeSize / 2) * Math.sin(angle),
          });
        }
        shape = new fabric.Polygon(hexPoints, {
          left: 100,
          top: 100,
          fill: color,
        });
        break;
      default:
        return;
    }

    if (shape) {
      shape.set({
        cornerStyle: "circle",
        transparentCorners: false,
        cornerColor: "rgba(0,0,0,0.5)",
        cornerStrokeColor: "rgba(255,255,255,0.5)",
        borderColor: "rgba(0,0,0,0.5)",
      });

      canvas.add(shape);
      canvas.setActiveObject(shape);
    }
    setShowToolsModal(false);
  };

  const renderToolSettings = () => {
    return (
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {activeTool === "Pencil" ? "Pencil Settings" : "Shape Settings"}
        </Typography>

        <Typography>Size</Typography>
        <Slider
          value={brushSize}
          onChange={(_, value) => setBrushSize(value)}
          min={1}
          max={50}
          sx={{ mb: 2 }}
        />

        <Typography>Color</Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: color,
            border: "2px solid #000",
            cursor: "pointer",
            mb: 2,
          }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />

        {showColorPicker && (
          <Box sx={{ position: "absolute", zIndex: 2 }}>
            <SketchPicker
              color={color}
              onChange={(color) => setColor(color.hex)}
            />
          </Box>
        )}

        {activeTool === "Shape" && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
          >
            {[
              "rectangle",
              "circle",
              "triangle",
              "ellipse",
              "star",
              "hexagon",
            ].map((shape) => (
              <IconButton
                key={shape}
                onClick={() => handleShapeTool(shape)}
                sx={{ border: "1px solid #ccc" }}
              >
                {shape.charAt(0).toUpperCase()}
              </IconButton>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} id="drawing-canvas" />
      <Modal open={showToolsModal} onClose={() => setShowToolsModal(false)}>
        {renderToolSettings()}
      </Modal>
    </>
  );
};

export default DrawingCanvas;
