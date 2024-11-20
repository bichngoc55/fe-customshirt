import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ImageSliderModal.css";

const ImageSliderModal = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen || !images || images.length === 0) return null;

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrevious(e);
    } else if (e.key === "ArrowRight") {
      handleNext(e);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button> */}

        <div className="image-container">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="main-image"
          />

          {images.length > 1 && (
            <>
              <button
                className="nav-button prev-button"
                onClick={handlePrevious}
              >
                <ChevronLeft size={24} />
              </button>
              <button className="nav-button next-button" onClick={handleNext}>
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="thumbnail-container">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`thumbnail-button ${
                  currentIndex === index ? "active" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="thumbnail-image"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSliderModal;
