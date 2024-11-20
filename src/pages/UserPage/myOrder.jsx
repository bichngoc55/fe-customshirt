import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  Avatar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PaypalIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import noImg from "../../assets/images/no_img.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, fetchOrders, updateOrder } from "../../redux/orderSlice";
import { format, parseISO } from "date-fns";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "var(--background-color)",
  borderRadius: "10px",
  border: "1px solid #C8FFF6",
  "& .MuiTableCell-root": {
    borderBottom: "1px solid #333",
    color: "white",
  },
}));
const InfoContainer = styled(Box)(({ theme }) => ({
  padding: "20px",
  marginTop: "20px",
  border: "0.2px solid #FA8B01",
  borderRadius: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: "20px",
}));

const InfoTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Montserrat",
  fontSize: "18px",
  fontWeight: "bold",
  color: "white",
  marginBottom: "16px",
}));

const InfoGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "Montserrat",
  fontSize: "14px",
  color: "white",
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontFamily: "Montserrat",
  fontSize: "14px",
  color: "white",
  textAlign: "right",
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    "& .MuiTableCell-root": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "16px",
  fontFamily: "Montserrat",
  fontSize: "14px",
  verticalAlign: "top",
  color: "#C8FFF6",
  transition: "background-color 0.3s",
}));

const DetailRow = styled(TableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderBottom: "none",
    padding: theme.spacing(1),
  },
}));

const DetailCell = styled(TableCell)(({ theme }) => ({
  paddingBottom: 0,
  paddingTop: 0,
}));

const DetailTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderRight: "1px solid #333",
    borderBottom: "1px solid #333",
    "&:last-child": {
      borderRight: "none",
    },
  },
  "& .MuiTableRow-root:last-child .MuiTableCell-root": {
    borderBottom: "none",
  },
}));
const DetailTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  fontFamily: "Montserrat",
  fontSize: "14px",
  color: "white",
}));

const DetailTableCellHead = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  fontFamily: "Montserrat",
  fontSize: "14px",
  color: "white",
  borderBottom: "1px solid #333",
}));

const MyOrder = () => {
  const [openRows, setOpenRows] = useState({});
  const { user } = useSelector((state) => state.auths);

  const handleRowClick = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(fetchOrders());
    // console.log("Orders fetched", orders);
  }, [dispatch]);
  const handleUpdateOrder = (id, orderData) => {
    dispatch(updateOrder({ id, orderData }));
  };

  const formattedDate = (date) => {
    return format(parseISO(date), "dd/MM/yy");
  };
  const handleCancelOrder = (id) => {
    const updatedOrderData = {
      deliveryStatus: "Cancelled",
    };
    dispatch(updateOrder({ id, orderData: updatedOrderData }));
  };
  const handleReceiveOrder = (id) => {
    const updatedOrderData = {
      deliveryStatus: "Received",
    };
    dispatch(updateOrder({ id, orderData: updatedOrderData }));
  };
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const formattedTime = (date) => {
    return format(parseISO(date), "HH:mm");
  };
  return (
    <Box sx={{ marginTop: "20px", marginLeft: "10%", marginRight: "10%" }}>
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
            {user.name ? user.name : "Anonymous"}
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
      <Box className="Order">
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Your order
        </Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Your order</StyledTableCell>
                <StyledTableCell>Payment Method</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Delivery Status</StyledTableCell>
                <StyledTableCell>Voucher</StyledTableCell>
                <StyledTableCell>Order Status</StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <StyledTableRow>
                    <StyledTableCell onClick={() => handleRowClick(order._id)}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: "grey.300",
                            borderRadius: 1,
                          }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: "Montserrat",
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginLeft: "10px",
                            }}
                          >
                            {order._id}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              marginBottom: "10px",
                            }}
                          >
                            <CalendarMonthOutlinedIcon
                              sx={{ color: "#FA8B02" }}
                            />
                            <Typography variant="body2" sx={{ color: "white" }}>
                              {formattedDate(order.deliveryDate)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccessTimeOutlinedIcon sx={{ color: "#FA8B02" }} />
                            <Typography sx={{ color: "white" }} variant="body2">
                              {formattedTime(order.deliveryDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: "#C8FFF6" }}>
                      {order.paymentDetails.method === "Cash" ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PaypalIcon /> Cash
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CreditCardIcon /> Credit Card
                        </Box>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatPrice(order.total)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {order.deliveryStatus === "On delivery" ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LocalShippingIcon sx={{ color: "orange" }} />
                          On delivery
                        </Box>
                      ) : order.deliveryStatus === "Cancelled" ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CancelIcon sx={{ color: "red" }} />
                          Cancelled
                        </Box>
                      ) : order.deliveryStatus === "Pending" ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AutorenewIcon sx={{ color: "red" }} />
                          Pending
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CheckCircleIcon sx={{ color: "green" }} />
                          Received
                        </Box>
                      )}
                    </StyledTableCell>

                    <StyledTableCell>
                      {order.voucherCode ? order.voucherCode : "No voucher"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {order.orderStatus ? order.orderStatus : "processing"}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(order._id)}
                      >
                        {openRows[order._id] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                  <DetailRow>
                    <DetailCell colSpan={6}>
                      <Collapse
                        in={openRows[order._id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1 }}>
                          <Typography
                            sx={{ fontFamily: "Montserrat" }}
                            gutterBottom
                            component="div"
                          >
                            Order Details
                          </Typography>
                          <DetailTable size="small" aria-label="purchases">
                            <Table
                              size="small"
                              aria-label="purchases"
                              sx={{
                                color: "white",
                                border: "1px solid #FA8B01",
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <DetailTableCell
                                    sx={{
                                      fontFamily: "Montserrat",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Product
                                  </DetailTableCell>
                                  <DetailTableCellHead
                                    sx={{
                                      fontFamily: "Montserrat",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Size
                                  </DetailTableCellHead>
                                  <DetailTableCellHead
                                    sx={{
                                      fontFamily: "Montserrat",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Color
                                  </DetailTableCellHead>
                                  <DetailTableCellHead
                                    align="right"
                                    sx={{
                                      fontFamily: "Montserrat",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Quantity
                                  </DetailTableCellHead>
                                  <DetailTableCellHead
                                    sx={{
                                      fontFamily: "Montserrat",
                                      fontWeight: "bold",
                                    }}
                                    align="right"
                                  >
                                    Price/Shirt
                                  </DetailTableCellHead>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.items.map((detail, index) => (
                                  <TableRow key={index}>
                                    <DetailTableCell component="th" scope="row">
                                      {detail.product.name}
                                    </DetailTableCell>
                                    <DetailTableCell>
                                      {detail.productSize}
                                    </DetailTableCell>
                                    <DetailTableCell>
                                      {detail.productColor}
                                    </DetailTableCell>
                                    <DetailTableCell align="right">
                                      {detail.productQuantity}
                                    </DetailTableCell>
                                    <DetailTableCell align="right">
                                      {formatPrice(detail.product.price)}
                                    </DetailTableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <DetailTableCell colSpan={4}>
                                    Total
                                  </DetailTableCell>
                                  <DetailTableCell align="right">
                                    {formatPrice(order.total)}
                                  </DetailTableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </DetailTable>
                          <InfoContainer>
                            <InfoSection>
                              <InfoTitle>Billing Information</InfoTitle>
                              <InfoGrid>
                                <InfoLabel>Address</InfoLabel>
                                <InfoValue>
                                  {order.billingAddress.details}
                                </InfoValue>
                                <InfoLabel>District</InfoLabel>
                                <InfoValue>
                                  {order.billingAddress.district}
                                </InfoValue>
                                <InfoLabel>Province</InfoLabel>
                                <InfoValue>
                                  {order.billingAddress.province}
                                </InfoValue>
                              </InfoGrid>
                            </InfoSection>

                            <InfoSection>
                              <InfoTitle>User Information</InfoTitle>
                              <InfoGrid>
                                <InfoLabel>Name</InfoLabel>
                                <InfoValue>{order.userInfo.name}</InfoValue>
                                <InfoLabel>Email</InfoLabel>
                                <InfoValue>{order.userInfo.email}</InfoValue>
                                <InfoLabel>Phone Number</InfoLabel>
                                <InfoValue>{order.userInfo.phone}</InfoValue>
                              </InfoGrid>
                            </InfoSection>

                            <InfoSection>
                              <InfoTitle>Order Summary</InfoTitle>
                              <InfoGrid>
                                <InfoLabel>Subtotal</InfoLabel>
                                <InfoValue>
                                  {formatPrice(order.total) -
                                    formatPrice(order.shippingFee)}{" "}
                                  VND
                                </InfoValue>
                                <InfoLabel>Shipping</InfoLabel>
                                <InfoValue>
                                  {formatPrice(order.shippingFee)}
                                </InfoValue>
                                <InfoLabel
                                  sx={{ fontWeight: "bold", color: "#FA8B02" }}
                                >
                                  Total
                                </InfoLabel>
                                <InfoValue
                                  sx={{ fontWeight: "bold", color: "#FA8B02" }}
                                >
                                  {formatPrice(order.total)} VND
                                </InfoValue>
                              </InfoGrid>
                            </InfoSection>
                          </InfoContainer>
                        </Box>
                      </Collapse>
                    </DetailCell>
                  </DetailRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>
    </Box>
  );
};

export default MyOrder;
