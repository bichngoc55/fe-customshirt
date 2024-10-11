import React, { useState } from "react";

const InputForm = ({
  placeholder,
  width,
  height,
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = (event) => {
    setIsFocused(true);
    if (onFocus) onFocus(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={{ width: width || "100%", height: height || "auto" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "100%",
          height: "100%",
          padding: "10px",
          border: `1px solid ${
            isFocused ? "white" : isHovered ? "#808080" : "#3C3B3B"
          }`,
          borderRadius: "4px",
          fontFamily: "Montserrat, sans-serif",
          color: "white",
          backgroundColor: "transparent",
          outline: "none",
          transition: "border-color 0.3s ease",
        }}
        className="custom-input"
      />
      <style jsx>{`
        .custom-input::placeholder {
          color: lightgray;
        }
      `}</style>
    </div>
  );
};

export default InputForm;
