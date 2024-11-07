import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#1a1a1a",
  width: 480,
  margin: "0 7px",
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
  scrollBehavior: "smooth",
  padding: "20px 0",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
});

const NavigationButton = styled(IconButton)(({ position }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  zIndex: 2,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  ...(position === "left" ? { left: 0 } : { right: 0 }),
}));

const ProductImage = styled(CardMedia)({
  height: 200,
  objectFit: "cover",
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
  useEffect(() => {
    let isSubscribed = true;

    const addAndFetchRecentProducts = async () => {
      if (!user?._id || !product?._id || isLoading) return;

      try {
        setIsLoading(true);

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
        console.log("recent viewed, ", data);

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

  const handleScroll = (direction) => {
    const container = document.getElementById("products-container");
    const scrollAmount = 300;
    if (container) {
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
        setScrollPosition(container.scrollLeft - scrollAmount);
      } else {
        container.scrollLeft += scrollAmount;
        setScrollPosition(container.scrollLeft + scrollAmount);
      }
    }
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
        {/* {recentProducts.length > 1 && (
          <>
            <NavigationButton
              position="left"
              onClick={() => handleScroll("left")}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeftIcon />
            </NavigationButton>
            <NavigationButton
              position="right"
              onClick={() => handleScroll("right")}
            >
              <ChevronRightIcon />
            </NavigationButton>
          </>
        )} */}

        <ProductsContainer id="products-container">
          {isLoading ? (
            <Typography
              sx={{ color: "white", textAlign: "center", width: "100%" }}
            >
              Loading...
            </Typography>
          ) : recentProducts.length > 0 ? (
            recentProducts.map((recentProduct) => (
              <StyledCard key={recentProduct._id}>
                <ProductImage
                  component="img"
                  image={
                    recentProduct.imageUrl?.[0] || "/placeholder-image.jpg"
                  }
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
                    {recentProduct.salePrice ? (
                      <>
                        <OriginalPrice variant="body1">
                          {recentProduct.price}VND
                        </OriginalPrice>
                        <SalePrice variant="body1">
                          {recentProduct.salePrice} VND
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
              sx={{ color: "white", textAlign: "center", width: "100%" }}
            >
              No recently viewed products
            </Typography>
          )}
        </ProductsContainer>
      </CarouselContainer>
    </Box>
  );
};

export default RecentViewedSlider;
