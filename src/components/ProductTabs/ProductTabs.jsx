import React, { useState } from "react";
import { Avatar, Rating } from "@mui/material";
import "./ProductTabs.css";
import BtnComponent from "../btnComponent/btnComponent";

const TabPanel = ({ children, value, index }) => {
  return (
    <div className="tab-panel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
};

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="product-tabs">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          onClick={() => handleTabChange(0)}
        >
          Description
        </button>
        <button
          className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          Reviews ({product.reviews?.length || 0})
        </button>
      </div>

      <TabPanel value={activeTab} index={0}>
        <div className="description-content">
          {product.description || "No description available."}
        </div>
        <div style={{ marginTop: "20px" }} className="description-content">
          Care Instruction
          <ul>
            <li>Wash at a normal temperature with similar colored items.</li>
            <li>Do not use bleach.</li>
            <li>Can be hand washed or machine washed.</li>
            <li>
              When drying, it is recommended to use a hanger to avoid distorting
              the product.
            </li>
          </ul>
        </div>
        <div
          style={{ marginTop: "20px", display: "flex" }}
          className="description-content"
        >
          Liên hệ tư vấn/ Contact
          <div style={{ marginLeft: "20px" }}>
            <BtnComponent
              handleClick={() => {}}
              value={"Start a conversation"}
              width={"300px"}
              height={"300px"}
            />
          </div>
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div className="reviews-container">
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <Avatar className="review-avatar">
                    {review.userId?.name?.[0] || "?"}
                  </Avatar>
                  <div className="review-user-info">
                    <p className="review-username">
                      {review.userId?.name || "Anonymous"}
                    </p>
                    <div className="review-rating">
                      <Rating value={review.stars} readOnly size="small" />
                      <span className="rating-text">{review.stars}/5</span>
                    </div>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                {index < product.reviews.length - 1 && (
                  <div className="review-divider" />
                )}
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </TabPanel>
    </div>
  );
};

export default ProductTabs;
