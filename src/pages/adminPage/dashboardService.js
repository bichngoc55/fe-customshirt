const API_BASE_URL = 'http://localhost:3005/revenue';

export const dashboardService = {
  getTotalOrdersStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/total`); // Removed ?paymentStatus=completed
      console.log(response);
  
      if (!response.ok) throw new Error('Failed to fetch total orders stats');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getLeastQuantityProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/least-quantity`);
      console.log(response);

      if (!response.ok) throw new Error('Failed to fetch least quantity products');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getTopProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/top`);
      console.log(response);

      if (!response.ok) throw new Error('Failed to fetch top products');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getRevenueData: async (year) => {
    try {
      const response = await fetch(`${API_BASE_URL}/revenue?year=${year}`);
      console.log(response);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getDailyRevenue: async (date) => {
    try {
        // Lấy năm, tháng và ngày
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng được tính từ 0
        const day = String(date.getDate()).padStart(2, '0');

        // Định dạng ngày theo 'YYYY-MM-DD'
        const formattedDate = `${year}-${month}-${day}`;
        // console.log("Formdata:", formattedDate);
        // http://localhost:3005/revenue/dailyrevenue?date=2023-01-01
        const response = await fetch(`${API_BASE_URL}/dailyrevenue?date=${formattedDate}`);
        if (!response.ok) throw new Error('Failed to fetch revenue data');
        
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch daily revenue');
    }
}
};