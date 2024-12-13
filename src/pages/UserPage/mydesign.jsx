import React, { useState, useEffect } from "react";
import {
  Avatar,
  styled,
  Box,
  Grid,
  Button,
  CardMedia,
  Typography,
  Dialog,
  Snackbar,
  Alert,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import noImg from "../../assets/images/no_img.jpeg";
import { useSDK } from "@metamask/sdk-react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";
import BtnComponent from "../../components/btnComponent/btnComponent";

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: "relative",
  transition: "all 0.3s",
  "&:hover": {
    "& .card-actions": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const CardActions = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  gap: "8px",
  opacity: 0,
  transform: "translateY(-10px)",
  transition: "all 0.3s",
}));
const MyDesign = () => {
  const { user, token } = useSelector((state) => state.auths);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState("");
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();
  const [deletingDesign, setDeletingDesign] = useState(null);
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  useEffect(() => {
    const fetchDesign = async () => {
      if (user) {
        // console.log("token", token);
        try {
          const result = await axios.get(`http://localhost:3005/design/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log("hehe: ", result);
          if (result.data.success) {
            setDesigns(result.data.designs);
          } else {
            // console.log("Failed to fetch designs");
            dispatch(logoutUser());
            navigate("/login");
          }
        } catch (error) {
          // console.error("Error fetching designs:", error);
          dispatch(logoutUser());
          navigate("/login");
        }
      }
    };

    fetchDesign();
  }, [user?._id, token]);

  // const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts);
      setAccount(accounts?.[0]);
      setIsAuthenticated(true);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };
  const handleDelete = (design) => {
    setDeletingDesign(design);
    setShowDeleteConfirm(true);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3005/design/${deletingDesign._id}`);
      setDesigns(designs.filter((d) => d._id !== deletingDesign._id));
      setShowDeleteConfirm(false);
      setDeletingDesign(null);
      setSnackbarMessage("Deleting design successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Error deleting design");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleUpdate = (design) => {
    console.log("Design: ", design);
    navigate(`/design/${design._id}`, { state: design });
  };

  const mintNFT = async () => {
    if (isAuthenticated && account) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/mint-nft",
          {
            userAddress: account,
            tokenURI: "https://your-metadata-url.com/metadata.json",
          }
        );

        if (response.data.success) {
          alert("NFT Minted Successfully!");
        } else {
          alert("Minting failed.");
        }
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    }
  };
  const getImageSrc = (base64String) => {
    if (base64String && typeof base64String === "string") {
      return base64String.startsWith("data:image/")
        ? base64String
        : `data:image/octet-stream;base64,${base64String}`;
    }
    return noImg;
  };

  return (
    <Box>
      <Box
        className="Avatar"
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <Avatar src={user.avaURL} sx={{ width: 50, height: 50 }} />
        <Box>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat",
              fontSize: "20px",
            }}
          >
            {user.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontFamily: "Montserrat",
              color: "#808080",
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>
      <div></div>
      <Box sx={{ padding: "20px", color: "white" }}>
        <Typography
          sx={{
            fontSize: "30px",
            fontWeight: "600",
            textAlign: "center",
            fontFamily: "Montserrat",
            marginBottom: "20px",
          }}
          gutterBottom
        >
          Your current saved designs
        </Typography>
        {designs?.length === 0 ? (
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            <Typography sx={{ fontFamily: "Montserrat", fontWeight: "bold" }}>
              You don't have any designs.
            </Typography>
            <Button
              sx={{
                marginTop: "10px",
                backgroundColor: "#8CFFB3",
                fontFamily: "Montserrat",
              }}
              onClick={() => navigate("/design")}
            >
              Start Drawing
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
            {designs?.map((design) => (
              <Grid item xs={12} sm={6} md={4} key={design._id}>
                <StyledCardMedia>
                  <img
                    src={getImageSrc(design.previewImage)}
                    alt={`Design ${design._id}`}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                  <CardActions className="card-actions">
                    <IconButton
                      onClick={() => handleUpdate(design)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(design)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <BtnComponent
                      handleClick={() => {
                        if (user === null) {
                          setSnackbarMessage("Please login to contact us");
                          setSnackbarSeverity("warning");
                          setOpenSnackbar(true);
                          return;
                        } else
                          navigate(`/design/payment/${design?._id}`, {
                            state: { design },
                          });
                      }}
                      value={"Buy Now"}
                      width={"400px"}
                      height={"400px"}
                    />
                  </CardActions>
                </StyledCardMedia>
              </Grid>
            ))}

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              {designs.length > 3 && (
                <>
                  <Button
                    onClick={() => console.log("")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: "white",
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    See more
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        )}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {!connected ? (
            <Button
              onClick={connect}
              sx={{
                color: "white",
                border: "1px solid white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              Connect Wallet
            </Button>
          ) : (
            <Typography>
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the design "{deletingDesign?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
};

export default MyDesign;
