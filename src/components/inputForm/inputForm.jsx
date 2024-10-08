import React, { useState } from "react";
import { TextField as MuiTextField } from "@mui/material";
import { styled } from "@mui/system";

const StyledTextField = styled(MuiTextField)(
  ({ width, height, isFocused }) => ({
    width: width,
    height: height,
    backgroundColor: "transparent",
    borderColor: isFocused ? "white" : "#3C3B3B",
    borderWidth: 1,
    padding: "15px",
    borderRadius: "20px",
    marginBottom: "15px",
    transition: "border-color 0.3s ease",
    "&:hover": {
      borderColor: "white",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "white",
      opacity: 1,
    },
  })
);

const InputForm = ({
  placeholder,
  width,
  height,
  value,
  onChange,
  onFocus,
  onBlur,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (event) => {
    setIsFocused(true);
    if (onFocus) onFocus(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <StyledTextField
      variant="outlined"
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={value}
      onChange={onChange}
      {...otherProps}
      sx={{
        borderColor: isFocused ? "white" : "#3C3B3B",
      }}
    />
  );
};

export default InputForm;
