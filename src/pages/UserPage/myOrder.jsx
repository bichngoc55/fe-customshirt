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
  Button,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  Collapse,
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
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  fetchOrders,
  updateDeliveryStatus,
  autoRefuseUnconfirmedOrders,
  fetchOrdersDetails,
  updateOrder,
} from "../../redux/orderSlice";
import { format, parseISO } from "date-fns";
import CancelOrderDialog from "../../components/ModalCancelOrder/ModalCancelOrder";
import BtnComponent from "../../components/btnComponent/btnComponent";
import { useNavigate } from "react-router-dom";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "var(--background-color)",
  borderRadius: "10px",
  border: "1px solid #C8FFF6",
  "& .MuiTableCell-root": {
    borderBottom: "1px solid #333",
    color: "white",
  },
  "& table": {
    tableLayout: "fixed",
    width: "100%",
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

const StyledTableCell = styled(TableCell)(({ theme, width }) => ({
  padding: "18px",
  fontFamily: "Montserrat",
  fontSize: "14px",
  verticalAlign: "top",
  color: "#C8FFF6",
  transition: "background-color 0.3s",
  width: width || "auto",
  minWidth: width || "auto",
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
  tableLayout: "fixed",
  width: "100%",
}));
const DetailTableCell = styled(TableCell)(({ theme, width }) => ({
  padding: "8px 16px",
  fontFamily: "Montserrat",

  fontSize: "14px",
  color: "white",
  width: width || "auto",
  minWidth: width || "auto",
}));

const DetailTableCellHead = styled(TableCell)(({ theme, width }) => ({
  padding: "8px 16px",
  fontFamily: "Montserrat",
  fontSize: "14px",
  color: "white",
  borderBottom: "1px solid #333",
  width: width || "auto",
  minWidth: width || "auto",
  fontWeight: "bold",
}));

const MyOrder = () => {
  const [openRows, setOpenRows] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auths);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { selectedItems } = useSelector((state) => state.cart);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const handleRowClick = (orderId, isCancelled, orderStatus) => {
    if (isCancelled || orderStatus === "refused") {
      return;
    }
    setOpenRows((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const [cancelingOrders, setCancelingOrders] = useState({});
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const {
    orders,
    status,
    error,
    cancelStatus,
    updateStatus,
    autoRefuseStatus,
  } = useSelector((state) => state.orders);
  useEffect(() => {
    if (user?._id) {
      setIsLoading(true);
      dispatch(fetchOrdersDetails(user._id))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [dispatch, user?._id]);
  useEffect(() => {
    const checkDeliveryStatus = () => {
      dispatch(updateDeliveryStatus());
    };

    checkDeliveryStatus();
    const interval = setInterval(checkDeliveryStatus, 3600000);

    return () => clearInterval(interval);
  }, [dispatch]);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    const checkUnconfirmedOrders = () => {
      dispatch(autoRefuseUnconfirmedOrders());
    };

    checkUnconfirmedOrders();
    const interval = setInterval(checkUnconfirmedOrders, 3600000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (autoRefuseStatus === "succeeded") {
      setSnackbarMessage("Unconfirmed orders auto-refused");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } else if (autoRefuseStatus === "failed") {
      setSnackbarMessage("Failed to auto-refuse unconfirmed orders");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }, [autoRefuseStatus]);
  const handleReceiveOrder = async (orderId) => {
    try {
      const result = await dispatch(
        updateOrder({
          id: orderId,
          orderData: {
            deliveryStatus: "delivered",
          },
        })
      ).unwrap();

      if (result) {
        setSnackbarMessage("Order marked as received successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        dispatch(fetchOrdersDetails(user._id));
      }
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to update order status");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
    }
  };
  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };
  const handleConfirmCancel = async () => {
    if (selectedOrderId) {
      await dispatch(cancelOrder(selectedOrderId));
      if (cancelStatus === "succeeded") {
        setSnackbarMessage("Order cancelled successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        // dispatch(fetchOrders());
      }
      dispatch(fetchOrders());
      setCancelDialogOpen(false);
      setSelectedOrderId(null);
    }
  };
  const handleCloseDialog = () => {
    setCancelDialogOpen(false);
    setSelectedOrderId(null);
  };

  const renderActionButtons = (order) => {
    return (
      <>
        {order.deliveryStatus === "Pending" &&
          order.orderStatus !== "refused" && (
            <Button
              variant="contained"
              color="error"
              disabled={cancelingOrders[order._id]}
              onClick={() => handleCancelOrder(order._id)}
              // startIcon={<CancelIcon />}
              sx={{
                fontFamily: "Montserrat",
                backgroundColor: "#FA8B01",
                marginRight: "20px",
                width: "100px",
                marginBottom: "20px",
                "&:hover": {
                  backgroundColor: "#d67601",
                },
              }}
            >
              {cancelingOrders[order._id] ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        {order.deliveryStatus !== "delivered" &&
          order.orderStatus !== "refused" && (
            <BtnComponent
              handleClick={() => {
                if (user === null) {
                  setSnackbarMessage("Please login to contact us");
                  setSnackbarSeverity("warning");
                  setOpenSnackbar(true);
                  return;
                } else {
                  // console.log("order", order);
                  handleReceiveOrder(order._id);
                }
              }}
              value={"RECEIVE"}
              width={"300px"}
              height={"300px"}
            />
          )}
      </>
    );
  };

  const formatPrice = (price) => {
    if (price == null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "...";
    try {
      return format(parseISO(dateString), "dd/MM/yy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formattedTime = (dateString) => {
    // return format(parseISO(date), "HH:mm");
    if (!dateString) return "...";
    try {
      return format(parseISO(dateString), "HH:mm");
    } catch (error) {
      return "Invalid time";
    }
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#FA8B01" }} />
        <Typography sx={{ fontFamily: "Montserrat" }}>
          Loading your orders...
        </Typography>
      </Box>
    );
  }
  console.log("orders", orders);
  if (!isLoading && (orders.length === 0 || orders === null)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ textAlign: "center", my: 4 }}>
          No orders found. Buy more products to create your first orders
        </Typography>
        <BtnComponent
          handleClick={() => {
            if (user === null) {
              setSnackbarMessage("Please login to contact us");
              setSnackbarSeverity("warning");
              setOpenSnackbar(true);
              return;
            } else navigate(`/collection`);
          }}
          value={"Start buying"}
          width={"300px"}
          height={"300px"}
        />
      </Box>
    );
  }
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
        <Avatar src={user.avaURL} sx={{ width: 50, height: 50 }} />
        <Box>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat",
              fontSize: "20px",
            }}
          >
            {user?.name ? user?.name : "Anonymous"}
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
          My order
        </Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width="25%">Your order</StyledTableCell>
                <StyledTableCell width="15%">Payment Method</StyledTableCell>
                <StyledTableCell width="12%">Price</StyledTableCell>
                <StyledTableCell width="15%">Delivery Status</StyledTableCell>
                <StyledTableCell width="12%">Voucher</StyledTableCell>
                <StyledTableCell width="12%">Order Status</StyledTableCell>
                <StyledTableCell width="15%">Payment Status</StyledTableCell>

                <StyledTableCell width="15%">Option</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 &&
                orders?.map((order) => {
                  const isCancelled = order.deliveryStatus === "cancelled";
                  const isRefused = order.orderStatus === "refused";
                  const isDisabled = isCancelled || isRefused;
                  return (
                    <React.Fragment key={order._id}>
                      <StyledTableRow
                        sx={{
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          opacity: isDisabled ? 0.7 : 1,
                        }}
                      >
                        <StyledTableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                onClick={() =>
                                  handleRowClick(
                                    order._id,
                                    isCancelled,
                                    order.orderStatus
                                  )
                                }
                                sx={{
                                  fontFamily: "Montserrat",
                                  fontSize: "16px",
                                  marginLeft: "10px",
                                  textDecoration: isCancelled
                                    ? "line-through"
                                    : "none",
                                  color: isCancelled ? "gray" : "inherit",
                                  fontWeight: "bold",
                                  // marginLeft: "10px",
                                }}
                              >
                                {order._id.slice(-15)}
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
                                <Typography
                                  variant="body2"
                                  sx={{ color: "white" }}
                                >
                                  {isCancelled
                                    ? "..."
                                    : formattedDate(order.deliveryDate)}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <AccessTimeOutlinedIcon
                                  sx={{ color: "#FA8B02" }}
                                />
                                <Typography
                                  sx={{ color: "white" }}
                                  variant="body2"
                                >
                                  {isCancelled
                                    ? "..."
                                    : formattedTime(order.deliveryDate)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          width="25%"
                          sx={{ color: "#C8FFF6", marginLeft: "20px" }}
                        >
                          {order.paymentDetails?.method === "Cash" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PaypalIcon /> Cash
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CreditCardIcon /> Credit Card
                            </Box>
                          )}
                        </StyledTableCell>
                        <StyledTableCell width="12%">
                          {formatPrice(order.total)}
                        </StyledTableCell>
                        <StyledTableCell width="15%">
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
                          ) : order?.deliveryStatus === "cancelled" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CancelIcon sx={{ color: "red" }} />
                              Cancelled
                            </Box>
                          ) : order.deliveryStatus === "Pending" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
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

                        <StyledTableCell width="12%">
                          {order.voucherId
                            ? order.voucherId.code
                            : "No voucher"}
                        </StyledTableCell>
                        <StyledTableCell width="12%">
                          {order.orderStatus &&
                          order.deliveryStatus !== "cancelled" ? (
                            <span
                              style={{
                                color: "green",
                                textTransform: "uppercase",
                              }}
                            >
                              {order.orderStatus}
                            </span>
                          ) : (
                            <span style={{ color: "red" }}>CANCELLED</span>
                          )}
                        </StyledTableCell>
                        <StyledTableCell width="15%">
                          <span
                            style={{
                              color:
                                order?.paymentDetails?.status === "failed"
                                  ? "red"
                                  : order?.paymentDetails?.status ===
                                    "completed"
                                  ? "green"
                                  : order?.paymentDetails?.status ===
                                    "processing"
                                  ? "yellow"
                                  : "yellow",
                              textTransform: "uppercase",
                            }}
                          >
                            {order?.paymentDetails?.status || "N/A"}{" "}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell width="15%">
                          {renderActionButtons(order)}
                        </StyledTableCell>
                        {/* <StyledTableCell>
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
                    </StyledTableCell> */}
                      </StyledTableRow>
                      <DetailRow>
                        <DetailCell colSpan={6}>
                          <Collapse
                            in={!isDisabled && openRows[order._id]}
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
                                        width="30%"
                                        sx={{
                                          fontFamily: "Montserrat",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Product
                                      </DetailTableCell>
                                      <DetailTableCellHead
                                        width="15%"
                                        sx={{
                                          fontFamily: "Montserrat",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Size
                                      </DetailTableCellHead>
                                      <DetailTableCellHead
                                        width="15%"
                                        sx={{
                                          fontFamily: "Montserrat",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Color
                                      </DetailTableCellHead>
                                      <DetailTableCellHead
                                        width="15%"
                                        align="right"
                                        sx={{
                                          fontFamily: "Montserrat",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Quantity
                                      </DetailTableCellHead>
                                      <DetailTableCellHead
                                        width="20%"
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
                                    {order?.items?.map((detail, index) => (
                                      <TableRow key={index}>
                                        <DetailTableCell
                                          component="th"
                                          scope="row"
                                        >
                                          {detail.product?.name != null
                                            ? detail.product?.name
                                            : detail.design?.name}
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
                                          {formatPrice(detail.productPrice)}
                                        </DetailTableCell>
                                      </TableRow>
                                    ))}
                                    {/* <TableRow>
                                  <DetailTableCell colSpan={4}>
                                    Total
                                  </DetailTableCell>
                                  <DetailTableCell align="right">
                                    {formatPrice(order.total)}
                                  </DetailTableCell>
                                </TableRow> */}
                                  </TableBody>
                                </Table>
                              </DetailTable>
                              <InfoContainer>
                                <InfoSection>
                                  <InfoTitle>Billing Information</InfoTitle>
                                  <InfoGrid>
                                    <InfoLabel>Address</InfoLabel>
                                    <InfoValue>
                                      {order?.billingAddress?.details}
                                    </InfoValue>
                                    <InfoLabel>District</InfoLabel>
                                    <InfoValue>
                                      {order?.billingAddress?.district}
                                    </InfoValue>
                                    <InfoLabel>Province</InfoLabel>
                                    <InfoValue>
                                      {order?.billingAddress?.province}
                                    </InfoValue>
                                  </InfoGrid>
                                </InfoSection>

                                <InfoSection>
                                  <InfoTitle>User Information</InfoTitle>
                                  <InfoGrid>
                                    <InfoLabel>Name</InfoLabel>
                                    <InfoValue>
                                      {order?.userInfo?.name}
                                    </InfoValue>
                                    <InfoLabel>Email</InfoLabel>
                                    <InfoValue>
                                      {order.userInfo?.email}
                                    </InfoValue>
                                    <InfoLabel>Phone Number</InfoLabel>
                                    <InfoValue>
                                      {order.userInfo?.phone}
                                    </InfoValue>
                                  </InfoGrid>
                                </InfoSection>

                                <InfoSection>
                                  <InfoTitle>Order Summary</InfoTitle>
                                  <InfoGrid>
                                    <InfoLabel>Subtotal</InfoLabel>
                                    <InfoValue>
                                      {formatPrice(
                                        order.total - order.shippingFee
                                      )}{" "}
                                      VND
                                    </InfoValue>
                                    <InfoLabel>Shipping</InfoLabel>
                                    <InfoValue>
                                      {formatPrice(order.shippingFee)} VND
                                    </InfoValue>
                                    <InfoLabel>Discount value</InfoLabel>
                                    <InfoValue>
                                      {order.voucherId?.discount} %
                                    </InfoValue>
                                    <InfoLabel
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#FA8B02",
                                      }}
                                    >
                                      Total
                                    </InfoLabel>
                                    <InfoValue
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#FA8B02",
                                      }}
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
                  );
                })}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>
      <CancelOrderDialog
        open={cancelDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
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
    </Box>
  );
};

export default MyOrder;
