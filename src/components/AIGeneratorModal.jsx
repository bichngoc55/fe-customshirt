import React from "react";
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
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateImage();
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
        {generatedImage && (
          <Box sx={{ mt: 2 }}>
            <img
              src={generatedImage}
              alt="AI Generated"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AIGeneratorModal;