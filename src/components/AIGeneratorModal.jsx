import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
  TextField,
} from "@mui/material";

const AIGeneratorModal = ({
  isAIModalOpen,
  setIsAIModalOpen,
  isGenerating,
  generateImage,
  generatedImage,
  prompt,
  setPrompt,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateImage();
    }
  };
  const handleImageClick = async (image, index) => {
    const imageUrl = `data:image/png;base64,${image}`;
    const processedImage = await removeBackground(imageUrl);
    if (processedImage) {
      setSelectedImage(processedImage);
    }
  };
  const removeBackground = async (imageUrl) => {
    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "Api-Key": "9vPP12bw3AKAVh1BqEAB61sP",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          size: "auto",
          format: "png",
        }),
      });
      console.log(response);

      if (!response.ok) throw new Error("Failed to remove background");

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error removing background:", error);
      return null;
    }
  };

  const handleCopyImage = async () => {
    if (selectedImage) {
      try {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        alert("Image copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy image:", error);
        alert("Failed to copy image to clipboard");
      }
    }
  };

  return (
    <Modal
      open={isAIModalOpen}
      onClose={() => setIsAIModalOpen(false)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1E1E1E",
          padding: 4,
          borderRadius: 2,
          width: "90%",
          maxWidth: "600px",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          AI Image Generator
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Describe the sticker you want to generate..."
          value={prompt}
          onChange={handlePromptChange}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8CFFB3",
              },
            },
            "& .MuiOutlinedInput-input": {
              color: "white",
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            sx={{
              bgcolor: "#8CFFB3",
              color: "black",
              "&:hover": {
                bgcolor: "#7deea2",
              },
              "&:disabled": {
                bgcolor: "rgba(140, 255, 179, 0.5)",
              },
            }}
          >
            {isGenerating ? <CircularProgress size={24} /> : "Generate"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsAIModalOpen(false)}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "#8CFFB3",
                color: "#8CFFB3",
              },
            }}
          >
            Close
          </Button>
        </Box>
        {/* {generatedImage.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 2,
              maxHeight: "400px",
              overflow: "auto",
            }}
          >
            {generatedImage.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  position: "relative",
                }}
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
              </Box>
            ))}
          </Box>
        )} */}
        {generatedImage.length > 0 && (
          <>
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 2,
              }}
            >
              {generatedImage.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    aspectRatio: "1/1",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(image, index)}
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
                </Box>
              ))}
            </Box>
            {selectedImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Processed Image (Background Removed)
                </Typography>
                <img
                  src={selectedImage}
                  alt="Processed"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "4px",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleCopyImage}
                  sx={{
                    mt: 2,
                    bgcolor: "#8CFFB3",
                    color: "black",
                    "&:hover": {
                      bgcolor: "#7deea2",
                    },
                  }}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AIGeneratorModal;
