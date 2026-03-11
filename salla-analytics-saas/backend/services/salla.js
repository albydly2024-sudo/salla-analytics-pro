const axios = require('axios');
const { getSettings } = require('../utils/settingsManager');

const SALLA_API_URL = 'https://api.salla.dev/admin/v2';

const getSallaAPI = () => {
  const { sallaToken } = getSettings();
  const TOKEN = sallaToken || process.env.SALLA_TOKEN; // Fallback to env if empty
  
  return axios.create({
    baseURL: SALLA_API_URL,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'application/json',
    }
  });
};

exports.getStoreInfo = async () => {
    try {
        const response = await getSallaAPI().get('/store/info');
        return response.data;
    } catch (error) {
        console.error("Salla API Error (Store Info):", error.response?.data || error.message);
        throw error;
    }
};

exports.getOrders = async () => {
    try {
        const response = await getSallaAPI().get('/orders');
        return response.data;
    } catch (error) {
        console.error("Salla API Error (Orders):", error.response?.data || error.message);
        throw error;
    }
};

exports.getProducts = async () => {
    try {
        const response = await getSallaAPI().get('/products');
        return response.data;
    } catch (error) {
         console.error("Salla API Error (Products):", error.response?.data || error.message);
         throw error;
    }
}

exports.getCustomers = async () => {
    try {
        const response = await getSallaAPI().get('/customers');
        return response.data;
    } catch (error) {
         console.error("Salla API Error (Customers):", error.response?.data || error.message);
         throw error;
    }
}
