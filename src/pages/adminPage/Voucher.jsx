import React, { useState, useEffect } from "react";
import "./Voucher.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalAddVoucher from "../../components/ModalAddVoucher/ModalAddVoucher";
import ModalUpdateVoucher from "../../components/ModalUpdateVoucher/ModalUpdateVoucher";
import ModalDeleteConfirm from "../../components/ModalDeleteConfirm/ModalDeleteConfirm";
import { 
  Snackbar,
  Alert
} from "@mui/material";

const Voucher = () => {
  const [vouchers, setVoucherCode] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
   const [snackbarState, setSnackbarState] = useState({
      open: false,
      message: "",
      severity: "success",
    });
  // const handleCopy = (code) => {
  //   navigator.clipboard.writeText(code);
  //   alert(`Copied: ${code}`);
  // };
  // useEffect(() => {
  //   const fetchVoucherCode = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3005/voucher");
  //       const { data } = await response.json();
  //       // console.log("voucher code:", data);
  //       setVoucherCode(data);
  //     } catch (e) {
  //       // console.error("Error:", e);
  //     }
  //   };

  //   fetchVoucherCode();
  // }, []);
  useEffect(() => {
    fetchVoucherCode();
  }, []);

  const fetchVoucherCode = async () => {
    try {
      const response = await fetch("http://localhost:3005/voucher");
      const { data } = await response.json();
      setVoucherCode(data);
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  const handleEditClick = (voucher) => {
    setSelectedVoucher(voucher);
    setUpdateModalOpen(true);
  };

  const handleAddVoucher = async (newVoucher) => {
    try {
      console.log("User ", newVoucher)
      const response = await fetch("http://localhost:3005/voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoucher),
      });
  // console.log("response :", response) ;
      if (response.ok) {
        const addedVoucher = await response.json();
        setVoucherCode((prevVouchers) => [...prevVouchers, addedVoucher.data]);  
        // alert("Voucher added successfully!");
          setSnackbarState({
        open: true,
        message: "Voucher added successfully!",
        severity: "success",
      });
      } else {
        setSnackbarState({
          open: true,
          message:  "Failed to add voucher",
          severity: "error",
        });      }
    } catch (error) {
      console.error("Error adding voucher:", error);
      alert("An error occurred while adding the voucher.");
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleUpdateVoucher = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:3005/voucher/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update voucher');
      }

      const { data } = await response.json();
      console.log("hehehehe", data)
      // Cập nhật state local
      setVoucherCode(prevVouchers =>
        prevVouchers.map(voucher =>
          voucher._id === id ? data : voucher
        )
      );

      // Fetch lại data từ server để đảm bảo đồng bộ
      fetchVoucherCode();
      
      return data;
    } catch (error) {
      console.error("Error updating voucher:", error);
      throw error;
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };
  if(vouchers===null ||vouchers.length ===0 ){
    return (
      <>
      <div style={{color:"white ", fontSize:"1.4rem", textAlign:"center"}}> 
      There is no voucher available! Create more</div>
      </>
    )
  }

const handleDeleteClick = (voucher) => {
  setVoucherToDelete(voucher);
  setIsDeleteModalOpen(true);
};

const handleCloseDeleteModal = () => {
  setIsDeleteModalOpen(false);
  setVoucherToDelete(null);
};

const handleConfirmDelete = async () => {
  if (!voucherToDelete) return;
  
  try {
    const response = await fetch(`http://localhost:3005/voucher/${voucherToDelete._id}`, {
      method: "DELETE"
    });
    
    if (response.ok) {
      setVoucherCode(prevVouchers => prevVouchers.filter(voucher => voucher._id !== voucherToDelete._id));
      setSnackbarState({
        open: true,
        message: "Voucher deleted successfully!",
        severity: "success"
      });
    } else {
      setSnackbarState({
        open: true,
        message: "Failed to delete voucher",
        severity: "error"
      });
    }
  } catch (error) {
    console.error("Error deleting voucher:", error);
    setSnackbarState({
      open: true,
      message: "Error deleting voucher",
      severity: "error"
    });
  }
  handleCloseDeleteModal();
};

  const handleDelete = async (id) => {
    try {
      // console.log("id", id)
      const response = await fetch(`http://localhost:3005/voucher/${id}`, {
        method: "DELETE"
      });
      // console.log("response", response);
      if (response.ok) {
        setVoucherCode(prevVouchers => prevVouchers.filter(voucher => voucher._id !== id));
        setSnackbarState({
          open: true,
          message: "Voucher deleted successfully!",
          severity: "success"
        });
      } else {
        setSnackbarState({
          open: true,
          message: "Failed to delete voucher",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      setSnackbarState({
        open: true,
        message: "Error deleting voucher",
        severity: "error"
      });
    }
  };

  return (
    <section className="voucher-section2">
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        width: "100%", 
        justifyContent: "space-between",
        padding: "0 20px"
      }}>
      <div style={{ flex: 1, textAlign: "center", fontSize: "35px"}}>
        <h2>VOUCHER</h2>
      </div>
      <button className="add-voucher-btn"
      onClick={() => setModalOpen(true)}>Add Voucher</button>
     </div>
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
                className="action-btn-voucher"
                onClick={() => handleCopy(voucher.code)}
              >
                <ContentCopyIcon />
                <span>Copy</span>
              </button>
              <button 
              className="action-btn-voucher"
              onClick={() => handleEditClick(voucher)}
              >
                <EditIcon />
                <span>Update</span>
              </button>
              <button 
  className="action-btn-voucher"
  onClick={() => handleDeleteClick(voucher)}
>
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
      <ModalAddVoucher
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  onAddVoucher={handleAddVoucher}
/>
<ModalUpdateVoucher
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        voucher={selectedVoucher}
        onUpdateVoucher={handleUpdateVoucher}
      />
      <ModalDeleteConfirm
  isOpenModal={isDeleteModalOpen}
  setOpenModal={setIsDeleteModalOpen}
  handleDeleteProduct={handleConfirmDelete}
  handleCloseDeleteModal={handleCloseDeleteModal}
/>
        <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ 
          vertical: snackbarState.vertical || 'top', 
          horizontal: snackbarState.horizontal || 'center' 
        }}
        sx={{ top: 20 }}
      >
        <Alert 
          onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </section>
    
  );
};

export default Voucher;
