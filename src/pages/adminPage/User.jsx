import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./User.css";
import ModalDeleteConfirm from "../../components/ModalDeleteConfirm/ModalDeleteConfirm";
import axios from "axios";
import { 
  Snackbar,
  Alert,
  Avatar
} from "@mui/material";

const UserTable = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [users, setUsers] = useState([]);
  useEffect(()=>{
    // console.log("HEHEHEH")
    const fetchUser = async ()=>{
      const response = await axios.get("http://localhost:3005/user/");
      console.log("response, ", response);
      const {users} = response.data;
      console.log("user",users);
      setUsers(users);
    }
    fetchUser();
  },[navigate])

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleChat = (id) => {
    navigate(`/admin/message/${id}`);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setSelectedUserId(null);
  };

  const handleOpenModalDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setIsOpenDeleteModal(true);
  };

  const handleReportUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axios.patch(`http://localhost:3005/user/${selectedUserId}`,{
        status:'down'
      });

      if (response.status === 200) {
        setIsOpenDeleteModal(false);
        setSnackbarMessage("User has been banned successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        
        // Update the users list after successful deletion
        // setUsers(users.filter(user => user._id !== selectedUserId));
      } else {
        setSnackbarMessage("Unable to update user status.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error banning user:", error);
      setSnackbarMessage("Error occurred while banning user");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  return (
    <div className="user-table-container">
      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>Account Status</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  <span
                    className={`account-status ${
                      user.status === "active" ? "status-active" : "status-down"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="user-details">
                  <Avatar src={user?.avaURL} alt="" />
                  <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <div
                    className="action-btn-more"
                    onClick={() => toggleDropdown(index)}
                  >
                    <span>•••</span>
                    {activeDropdown === index && (
                      <div className="dropdown-menu active">
                        <div className="dropdown-item chat" onClick={()=> handleChat(user?._id)}>
                          Chat
                        </div>
                        <div
                          className="dropdown-item report"
                          onClick={() => handleOpenModalDeleteClick(user._id)}
                        >
                          Report User
                        </div>
                       
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalDeleteConfirm
        isOpenModal={isOpenDeleteModal}
        setOpenModal={setIsOpenDeleteModal}
        handleDeleteProduct={handleReportUser}
        handleCloseDeleteModal={handleCloseDeleteModal}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
      </Snackbar>
      
    </div>
  );
};

export default UserTable;
