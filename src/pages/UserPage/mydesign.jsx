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
// import { useSDK } from "@metamask/sdk-react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";
import BtnComponent from "../../components/btnComponent/btnComponent";
import {
  ConnectButton,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
// import { mintTo } from "thirdweb/extensions/erc721";
// import { lineaSepolia } from "thirdweb/chains";
// import { useReadContract } from "thirdweb/react";

// Initialize ThirdWeb client
export const client = createThirdwebClient({
  clientId:
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
    "5a5bd55ce38291fd0a5c589c6a14cccc",
});

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
// const contract = getContract({
//   client,
//   chain: lineaSepolia,
//   address: "0x86F60bEb8b0d8316Ff2FaC9B4228e57D0d3096fb",
// });
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
  // const [account, setAccount] = useState("");
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();
  const [deletingDesign, setDeletingDesign] = useState(null);
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  //  thirdweb
  const [isMinting, setIsMinting] = useState(false);

  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  // Initialize contract

  // console.log("contrac", contract);
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
          if (result.data.success) {
            setDesigns(result.data.designs);
          } else {
            dispatch(logoutUser());
            navigate("/login");
          }
        } catch (error) {
          dispatch(logoutUser());
          navigate("/login");
        }
      }
    };

    fetchDesign();
  }, [user?._id, token]);
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
    // console.log("Design: ", design);
    navigate(`/design/${design._id}`, { state: design });
  };

  // const mintNFT = async (design) => {
  //   try {
  //     if (!account?.address) {
  //       setSnackbarMessage("Please connect your wallet first");
  //       setSnackbarSeverity("warning");
  //       setOpenSnackbar(true);
  //       return;
  //     }

  //     setIsMinting(true);
  //     setSnackbarMessage("Starting NFT minting process...");
  //     setSnackbarSeverity("info");
  //     setOpenSnackbar(true);
  //     try {
  //       const contractType = await contract.read.supportsInterface(
  //         "0x80ac58cd"
  //       );
  //       // console.log("Contract supports ERC721:", contractType);
  //     } catch (err) {
  //       console.error("Failed to verify contract:", err);
  //       throw new Error("Contract verification failed");
  //     }

  //     const transactionPayload = mintTo({
  //       contract,
  //       to: account.address,
  //       nft: {
  //         name: `Design #${design?._id}`,
  //         description: "Custom Design NFT",
  //         image: design.cloudinaryImage,
  //         attributes: [
  //           {
  //             trait_type: "Designer",
  //             value: user.name,
  //           },
  //           {
  //             trait_type: "Created",
  //             value: new Date(design.createdAt).toISOString(),
  //           },
  //         ],
  //       },
  //     });

  //     // console.log(
  //     //   "Transaction payload:",
  //     //   JSON.stringify(transactionPayload, null, 2)
  //     // );

  //     // const result = await sendTransaction(transactionPayload);
  //     const { transactionHash } = await sendTransaction({
  //       account,
  //       transactionPayload,
  //     });
  //     // console.log(
  //     //   "Mint transaction result:",
  //     //   JSON.stringify(transactionHash, null, 2)
  //     // );

  //     if (!transactionHash) {
  //       throw new Error("Transaction failed - no result returned");
  //     }

  //     // Wait a bit for transaction to be mined
  //     await new Promise((resolve) => setTimeout(resolve, 5000));

  //     const nftData = {
  //       // tokenId: result?.id ? result.id.toString() : "pending",
  //       contractAddress: contract.address,
  //       mintTransactionHash: transactionHash,
  //       metadata: {
  //         name: `Design #${design?._id}`,
  //         description: "Custom Design NFT",
  //         image: design.cloudinaryImage,
  //         attributes: [
  //           {
  //             trait_type: "Designer",
  //             value: user.name,
  //           },
  //           {
  //             trait_type: "Created",
  //             value: new Date(design.createdAt).toISOString(),
  //           },
  //         ],
  //       },
  //       network: "linea-sepolia",
  //     };

  //     // console.log("NFT data to be saved:", JSON.stringify(nftData, null, 2));

  //     await axios.post(
  //       `http://localhost:3005/nft/mint`,
  //       {
  //         designId: design._id,
  //         nftData,
  //         mintedBy: user._id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setSnackbarMessage("NFT minted successfully!");
  //     setSnackbarSeverity("success");
  //     setOpenSnackbar(true);
  //   } catch (error) {
  //     console.error("Minting error:", error);
  //     setSnackbarMessage("Failed to mint NFT");
  //     setSnackbarSeverity("error");
  //     setOpenSnackbar(true);
  //   } finally {
  //     setIsMinting(false);
  //   }
  // };
  const mintNFT = async (design) => {};
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
                    <Button
                      onClick={() => mintNFT(design)}
                      disabled={isMinting || !account?.address}
                      sx={{
                        backgroundColor: "#8CFFB3",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "#7DEEA2",
                        },
                        "&:disabled": {
                          backgroundColor: "#CCCCCC",
                        },
                      }}
                    >
                      {isMinting ? "Minting..." : "Mint NFT"}
                    </Button>
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
          <ConnectButton client={client} />
          {/* <p>Wallet address: {account.address}</p>
      <p>
        Wallet balance: {balance?.displayValue} {balance?.symbol}
      </p> */}

          {/* {!connected ? (
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
          )} */}
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
