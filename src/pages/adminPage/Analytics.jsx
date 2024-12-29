import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css"; 
import { Box, Button, Typography, Card, Grid, } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LineChart } from '@mui/x-charts/LineChart'; 
import { dashboardService } from "./dashboardService";
import {
  Person as OrderIcon, 
} from "@mui/icons-material";
import axios from "axios";

const TopRowCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#131720",
  paddingTop: theme.spacing(2),
  paddingLeft: theme.spacing(3.5),
  paddingRight: theme.spacing(3.5),
  borderRadius: theme.shape.borderRadius * 2,
  border: "1px solid #759AF9",
  color: "white",
  height: "185px", // Chiều cao cố định cho hàng đầu
  overflow: "auto",
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#131720',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#2d3748',
    borderRadius: '4px',
  },
}));

// Card cho hàng thứ hai - chiều cao khác với hàng đầu
const BottomRowCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#131720",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: "1px solid #759AF9",
  color: "white",
  height: "400px", // Chiều cao khác cho hàng dưới
  overflow: "auto",
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#131720',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#2d3748',
    borderRadius: '4px',
  },
}));

const ProgressBar = styled(Box)(({ value }) => ({
  width: "100px",
  height: "8px",
  backgroundColor: "#a6f4ea",
  borderRadius: "4px",
  overflow: "hidden",
  "& .progress": {
    height: "100%",
    backgroundColor: "#4fd1c5",
    width: `${value}%`,
    transition: "width 0.3s ease-in-out"
  }
}));

const GaugeChart = styled(Box)(({ value }) => ({
  position: "relative",
  width: "200px",
  height: "100px",
  margin: "20px auto",
  "&:before": {
    content: '""',
    position: "absolute",
    width: "200px",
    height: "100px",
    borderRadius: "100px 100px 0 0",
    backgroundColor: "#2d3748"
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "200px",
    height: "100px",
    borderRadius: "100px 100px 0 0",
    backgroundColor: "#4fd1c5",
    transform: `rotate(${(value / 100) * 180}deg)`,
    transformOrigin: "center bottom",
    transition: "transform 0.3s ease-in-out"
  }
}));

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ username: "Guest" });
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, weeklyGrowth: '0%' });
  const [leastQuantityProducts, setLeastQuantityProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState({ monthlyData: [], earnings: { total: 0, growth: 0 } });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3005/user/");
        const userData = response.data.users[0]; // Giả định API trả về danh sách user
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [
          orderStatsData,
          leastQuantityData,
          topProductsData,
          revenueData
        ] = await Promise.all([
          dashboardService.getTotalOrdersStats(),
          dashboardService.getLeastQuantityProducts(),
          dashboardService.getTopProducts(),
          dashboardService.getRevenueData()
        ]);
        // Update state with fetched data
        setOrderStats(orderStatsData);
        setLeastQuantityProducts(leastQuantityData);
        setTopProducts(topProductsData);
        setRevenueData(revenueData);
      } catch (error) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error('Dashboard data fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const lineChartData = {
    xAxis: [{
      data: revenueData.monthlyData.map(item => item.month),
      scaleType: 'band',
    }],
    series: [{
      data: revenueData.monthlyData.map(item => item.revenue),
      color: '#4fd1c5',
      area: true,
    }],
  };

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography color="error" sx={{ mb: 2, fontFamily: 'Montserrat' }}>{error}</Typography>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div className="analytics-container">
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, color: "#C8FFF6", fontFamily: 'Montserrat', fontWeight: 600, fontSize: 24 }}>
          Welcome Back,
        </Typography>
        <Typography variant="h3" sx={{ mb: 1, color: "#C8FFF6", fontFamily: 'Montserrat', fontWeight: 600, fontSize: 24 }}>
          {user.username}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, color: "white", fontFamily: 'Montserrat', fontSize: 15 }}>
          Here is the information about all your orders
        </Typography>

        {/* Hàng đầu tiên - 3 card cùng kích thước */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Least Quantity Products - chiếm 30% chiều ngang */}
          <Grid item xs={12} md={4.5}>
            <TopRowCard>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Montserrat', fontSize: 17, fontWeight: 600, color: "#a6f4ea", }}>Least Quantity Product</Typography>
              {leastQuantityProducts.map((product) => (
                <Box key={product.id} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                    <Typography sx={{ fontFamily: 'Montserrat', color: "white", fontSize: 12, fontWeight: 600 }}>#{product.id}</Typography>
                    <Typography sx={{ fontFamily: 'Montserrat', fontSize: 12 }}>{product.name}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'Montserrat', color: "#a6f4ea", ml: 2, fontSize: 12, fontWeight: 600 }}>
                    {product.quantity}
                  </Typography>
                </Box>
              ))}
            </TopRowCard>
          </Grid>

          {/* Total Orders - chiếm 40% chiều ngang */}
          <Grid item xs={12} md={3}>
            <TopRowCard>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 , }}>
                <Typography variant="h3" sx={{ fontFamily: 'Montserrat',fontWeight: 600  }}>
                  {orderStats.totalOrders.toLocaleString()}
                </Typography>
                <OrderIcon sx={{ fontSize: 40, color: "#4fd1c5", color: "#a6f4ea"}} />
              </Box>
              <Typography sx={{ color: "white", fontFamily: 'Montserrat', fontSize: 12, mb: 1 }}>Total orders</Typography>
              <Typography 
                sx={{ 
                  fontFamily: 'Montserrat',
                  fontSize: 12,
                  color: orderStats.weeklyGrowth.includes('+') ? '#34c759' : '#ff3b30'
                }}
              >
                {orderStats.weeklyGrowth}
              </Typography>
            </TopRowCard>
          </Grid>

          {/* Top Products - chiếm 30% chiều ngang */}
          <Grid item xs={12} md={4.5}>
            <TopRowCard>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Montserrat', fontSize: 17, fontWeight: 600, color: "#a6f4ea", }}>Top Products</Typography>
              {topProducts.map((product) => (
                <Box key={product.id} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography sx={{ fontFamily: 'Montserrat', color: "white", fontSize: 12, fontWeight: 600 }}>#{product.id}</Typography>
                    <Typography sx={{ fontFamily: 'Montserrat', fontSize: 12 }}>{product.name}</Typography>
                  </Box>
                  <ProgressBar value={(product.sales / Math.max(...topProducts.map(p => p.sales))) * 100}>
                    <Box className="progress" />
                  </ProgressBar>
                </Box>
                
              ))}
            </TopRowCard>
          </Grid>
        </Grid>

        {/* Hàng thứ hai - 2 card với chiều cao khác hàng trên */}
        <Grid container spacing={4}>
          {/* Revenue Chart - chiếm 65% chiều ngang */}
          <Grid item xs={12} md={8}>
            <BottomRowCard>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: 17, fontWeight: 600, color: "#a6f4ea", }}>Total Revenue</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#759AF9", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "white", fontFamily: 'Montserrat' }}>Revenue</Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    sx={{ 
                      bgcolor: "#759AF9",
                      fontFamily: 'Montserrat',
                      color: "#131720",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.2)" , color: "white",}
                    }}
                  >
                    Monthly
                  </Button>
                </Box>
              </Box>
              <LineChart
                height={300}
                series={lineChartData.series}
                xAxis={lineChartData.xAxis}
                sx={{
                  '.MuiLineElement-root': {
                    strokeWidth: 2,
                  },
                  '.MuiChartsAxis-bottom .MuiChartsAxis-line': {
                    stroke: '#2d3748',
                  },
                  '.MuiChartsAxis-bottom .MuiChartsAxis-tick': {
                    stroke: '#2d3748',
                  },
                  '.MuiChartsAxis-bottom text': {
                    fill: 'white',
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                  },
                  '.MuiChartsAxis-left .MuiChartsAxis-line': {
                    stroke: '#2d3748',
                  },
                  '.MuiChartsAxis-left .MuiChartsAxis-tick': {
                    stroke: '#2d3748',
                  },
                  '.MuiChartsAxis-left text': {
                    fill: 'white',
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                  },
                  '.MuiAreaElement-root': {
                    fill: 'url(#gradient)',
                    opacity: 0.1,
                  },
                }}
                margin={{ top: 20, right: 20, bottom: 30, left: 65 }}
              >
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4fd1c5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#4fd1c5" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </LineChart>
            </BottomRowCard>
          </Grid>

          {/* Earnings - chiếm 35% chiều ngang */}
          <Grid item xs={12} md={4}>
            <BottomRowCard>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Montserrat', fontSize: 17, fontWeight: 600, color: "#a6f4ea", }}>Earnings</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "white", fontFamily: 'Montserrat' }}>Total Expense</Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ 
                    bgcolor: "rgba(255,255,255,0.1)",
                    fontFamily: 'Montserrat',
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                  }}
                >
                  Today
                </Button>
              </Box>
              <Typography variant="h5" sx={{ mt: 2, fontFamily: 'Montserrat' }}>
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND'
                }).format(revenueData.earnings.total)}
              </Typography>
              <Typography sx={{ color: "white", variant: "body2", fontFamily: 'Montserrat' }}>
                Profit is {revenueData.earnings.growth}% More
                <br />than last Month
              </Typography>
              <GaugeChart value={revenueData.earnings.growth} />
            </BottomRowCard>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Analytics;