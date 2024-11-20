import React, { useState,useEffect } from "react";
import "./Voucher.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// const vouchers = [
//   {
//     discount: "5% OFF",
//     forText: "FOR WHOLE ORDER",
//     code: "CODE_123sksdlof",
//     validFrom: "05/08/2021 04:00",
//     validTo: "09/08/2021 12:00",
//     forProducts: "For all products.",
//   },
//   {
//     discount: "5% OFF",
//     forText: "FOR WHOLE ORDER",
//     code: "CODE_456xyzabc",
//     validFrom: "10/08/2021 04:00",
//     validTo: "15/08/2021 12:00",
//     forProducts: "For selected items.",
//   },
//   {
//     discount: "5% OFF",
//     forText: "FOR WHOLE ORDER",
//     code: "CODE_789abcdxyz",
//     validFrom: "16/08/2021 04:00",
//     validTo: "20/08/2021 12:00",
//     forProducts: "For all products.",
//   },
// ];

const Voucher = () => {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };
  const [vouchers,setVoucherCode]=useState([])
  useEffect(() => {
    const fetchVoucherCode = async () => {
      try {
        const response = await fetch("http://localhost:3005/voucher");
        const { data } = await response.json();
        // console.log("voucher code:", data);
        setVoucherCode(data);
      } catch (e) {
        // console.error("Error:", e);
      }
    };

    fetchVoucherCode();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  return (
    <section className="voucher-section">
      <h2>VOUCHER</h2>
      <button className="add-voucher-btn">Add voucher</button>
      <div className="voucher-grid">
        {vouchers.map((voucher) => (
          <div key={voucher.code} className="voucher-item">
            <h3>{voucher.discount}</h3>
            <p className="for-text">{voucher.name}</p>
            <div className="voucher-code">
              <span>Code: {voucher.code}</span>
            </div>
            <div className="voucher-actions">
              <button
                className="action-btn"
                onClick={() => handleCopy(voucher.code)}
              >
                <ContentCopyIcon />
                <span>Copy</span>
              </button>
              <button className="action-btn">
                <EditIcon />
                <span>Update</span>
              </button>
              <button className="action-btn">
                <DeleteIcon />
                <span>Delete</span>
              </button>
            </div>
            <p className="validity">
            • {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
            </p>
            <p className="for-products">• {voucher.conditions}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Voucher;
