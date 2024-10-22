import React, { useState } from "react";
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
import PaypalIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import noImg from "../../assets/images/no_img.jpeg";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "var(--background-color)",
  borderRadius: "10px",
  border: "1px solid #C8FFF6",
  "& .MuiTableCell-root": {
    borderBottom: "1px solid #333",
    color: "white",
  },
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

// const DetailTable = styled(Table)(({ theme }) => ({
//   "& .MuiTableCell-root": {
//     borderRight: "1px solid rgba(255, 255, 255, 0.1)", // Light grey vertical line
//     "&:last-child": {
//       borderRight: "none", // Remove right border for last cell
//     },
//   },
// }));
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

  const handleRowClick = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const orders = [
    {
      id: 1,
      orderId: 1234567890,
      date: "FRI, 23 DEC 2022",
      time: "15:00",
      paymentMethod: "Paypal",
      price: "€86.00",
      status: "On delivery",
      voucher: "10%",
      details: [
        {
          name: "Capybara T-shirt",
          size: "M",
          color: "White",
          quantity: 1,
          price: "€43.00",
        },
        {
          name: "Capybara T-shirt",
          size: "L",
          color: "Black",
          quantity: 1,
          price: "€43.00",
        },
      ],
    },
    {
      id: 2,
      orderId: 1234567891,
      date: "FRI, 23 DEC 2022",
      time: "15:00",
      paymentMethod: "Credit Card",
      price: "€86.00",
      status: "Received",
      voucher: "10%",
      details: [
        {
          name: "Capybara T-shirt",
          size: "M",
          color: "White",
          quantity: 1,
          price: "€43.00",
        },
        {
          name: "Capybara T-shirt",
          size: "L",
          color: "Black",
          quantity: 1,
          price: "€43.00",
        },
      ],
    },
  ];

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
            Gấu Tối
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontFamily: "Montserrat",
              color: "#808080",
            }}
          >
            alexarawles@gmail.com
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
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Voucher</StyledTableCell>
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <StyledTableRow>
                    <StyledTableCell onClick={() => handleRowClick(order.id)}>
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
                            {order.orderId}
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
                              {order.date}
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
                              {order.time}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell sx={{ color: "#C8FFF6" }}>
                      {order.paymentMethod === "Paypal" ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PaypalIcon /> Paypal
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CreditCardIcon /> Credit Card
                        </Box>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{order.price}</StyledTableCell>
                    <StyledTableCell>
                      {order.status === "On delivery" ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocalShippingIcon sx={{ color: "orange" }} />
                          On delivery
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CheckCircleIcon sx={{ color: "green" }} />
                          Received
                        </Box>
                      )}
                    </StyledTableCell>

                    <StyledTableCell>
                      {order.voucher ? order.voucher : "No voucher"}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(order.id)}
                      >
                        {openRows[order.id] ? (
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
                        in={openRows[order.id]}
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
                                    Price
                                  </DetailTableCellHead>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.details.map((detail, index) => (
                                  <TableRow key={index}>
                                    <DetailTableCell component="th" scope="row">
                                      {detail.name}
                                    </DetailTableCell>
                                    <DetailTableCell>
                                      {detail.size}
                                    </DetailTableCell>
                                    <DetailTableCell>
                                      {detail.color}
                                    </DetailTableCell>
                                    <DetailTableCell align="right">
                                      {detail.quantity}
                                    </DetailTableCell>
                                    <DetailTableCell align="right">
                                      {detail.price}
                                    </DetailTableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <DetailTableCell colSpan={4}>
                                    Total
                                  </DetailTableCell>
                                  <DetailTableCell align="right">
                                    {order.price}
                                  </DetailTableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </DetailTable>
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
