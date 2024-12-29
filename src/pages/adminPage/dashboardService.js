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

  getRevenueData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/revenue`);
      console.log(response);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};