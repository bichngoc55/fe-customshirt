import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  styled,
} from "@mui/material";
import noImg from "../../assets/images/no_img.jpeg";
import { Link, useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#4B545C",
  // width: 480,
  margin: "0 7px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "auto",
  position: "relative",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const CarouselContainer = styled(Box)({
  position: "relative",
  width: "100%",
  padding: "0 40px",
});

const ProductsContainer = styled(Box)({
  display: "flex",
  overflowX: "auto",
  // width: "50%",
  height: "auto",
  scrollBehavior: "smooth",
  padding: "20px 0",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
});

const ProductImage = styled(CardMedia)({
  height: 380,
  objectFit: "cover",
  borderRadius: "5px",
});

const ProductInfo = styled(CardContent)({
  padding: "16px",
});

const PriceContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginTop: "8px",
});

const OriginalPrice = styled(Typography)({
  color: "#888",
  textDecoration: "line-through",
});

const SalePrice = styled(Typography)({
  color: "#ff4444",
  fontWeight: 600,
});

const RecentViewedSlider = ({ user, product }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true;

    const addAndFetchRecentProducts = async () => {
      if (!user?._id || !product?._id || isLoading) return;

      try {
        setIsLoading(true);
        // console.log("recent viewed,111 ", user?._id, product?._id);

        // Add to recent products
        const addResponse = await fetch(
          "http://localhost:3005/user/recentProduct",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user?._id,
              productId: product?._id,
            }),
          }
        );

        if (!addResponse.ok) {
          throw new Error("Failed to add recent product");
        }

        // Fetch updated recent products
        const fetchResponse = await fetch(
          `http://localhost:3005/user/recentProduct/${user?._id}`
        );

        if (!fetchResponse.ok) {
          throw new Error("Failed to fetch recent products");
        }

        const data = await fetchResponse.json();
        // console.log("recent viewed, ", data);

        const recentProductsData = await data.map((t) => t.shirtId).slice(0, 4);
        console.log("recent viewed,222 ", recentProductsData);
        setRecentProducts(recentProductsData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    addAndFetchRecentProducts();
    return () => {
      isSubscribed = false;
    };
  }, [user?._id, product?._id]);
  const formatPrice = (price) => {
    if (price == null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateSalePrice = (product) => {
    if (product.isSale) {
      return product.price * (1 - product.salePercent / 100);
    }
    return product.price;
  };
  return (
    <Box sx={{ mt: 4, mx: "8%" }}>
      <Box sx={{ borderTop: "1px solid #333", my: 2 }} />
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Montserrat",
          color: "white",
          textAlign: "center",
          mb: 2,
        }}
      >
        Recently Viewed Products
      </Typography>

      <CarouselContainer>
        <ProductsContainer id="products-container">
          {isLoading ? (
            <Typography
              sx={{ color: "white", textAlign: "center", width: "100%" }}
            >
              Loading...
            </Typography>
          ) : recentProducts.length > 0 ? (
            recentProducts.map((recentProduct) => (
              <StyledCard
                key={recentProduct._id}
                onClick={() =>
                  navigate(`/collection/${recentProduct._id}`, {
                    state: { recentProduct },
                  })
                }
              >
                <ProductImage
                  component="img"
                  image={recentProduct.imageUrl?.[0] || noImg}
                  alt={recentProduct.name}
                />

                <ProductInfo>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "1rem",
                      textAlign: "center",
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {recentProduct.name}
                  </Typography>

                  <PriceContainer>
                    {recentProduct.isSale ? (
                      <>
                        <OriginalPrice variant="body1">
                          {formatPrice(recentProduct.price)}VND
                        </OriginalPrice>
                        <SalePrice variant="body1">
                          {formatPrice(calculateSalePrice(recentProduct))} VND
                        </SalePrice>
                      </>
                    ) : (
                      <SalePrice variant="body1">
                        {recentProduct.price} VND
                      </SalePrice>
                    )}
                  </PriceContainer>
                </ProductInfo>
              </StyledCard>
            ))
          ) : (
            <Typography
              sx={{
                color: "white",
                textAlign: "center",
                width: "100%",
                marginLeft: "-20px",
              }}
            >
              You have to login to view this section
            </Typography>
          )}
        </ProductsContainer>
      </CarouselContainer>
    </Box>
  );
};

export default RecentViewedSlider;
