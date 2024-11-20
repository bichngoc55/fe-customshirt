import React, { useState, useEffect } from "react";
import {
  Avatar,
  styled,
  Card,
  Box,
  Grid,
  Button,
  CardMedia,
  Typography,
} from "@mui/material";
import BtnComponent from "../../components/btnComponent/btnComponent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import noImg from "../../assets/images/no_img.jpeg";
import axios from "axios";
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  border: "1px solid #ffffff30",
  borderRadius: "8px",
  overflow: "hidden",
}));
const MyDesign = () => {
  const user = useSelector((state) => state.auths);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState("");
  const designs = [
    { id: 1, image: "../../assets/images/no-img.jpeg" },
    { id: 2, image: "../../assets/images/no-img.jpeg" },
    { id: 3, image: "../../assets/images/no-img.jpeg" },
  ];

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsAuthenticated(true);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const mintNFT = async () => {
    if (isAuthenticated && account) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/mint-nft",
          {
            userAddress: account, // Use connected wallet address
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
        <Avatar src={noImg} sx={{ width: 50, height: 50 }} />
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
        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
            {designs.map((design) => (
              <Grid item xs={12} sm={6} md={4} key={design.id}>
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="300"
                    image={design.image}
                    alt={`T-shirt design ${design.id}`}
                  />
                </StyledCard>
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
              <Button
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: "white",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                See more
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <BtnComponent
            value={isAuthenticated ? "Mint NFT" : "Connect Wallet"}
            width={"100%"}
            height={"50px"}
            onClick={isAuthenticated ? mintNFT : handleConnect}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MyDesign;
