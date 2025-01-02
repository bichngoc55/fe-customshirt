import { useState, useEffect } from "react";

const useInputDevice = () => {
  const [inputDevice, setInputDevice] = useState("mouse");

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.pointerType === "touch") {
        setInputDevice("touch");
      } else {
        setInputDevice("mouse");
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return inputDevice;
};

export default useInputDevice;
