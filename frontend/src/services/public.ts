import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8222',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPublicAccessPoints = async () => {
  try {
    const response = await apiClient.get('/api/v1/public/access-point');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getFare = async (source: string, destination: string) => {
  try {
    const response = await apiClient.get(
      `/api/v1/public/transaction/fare?source=${source}&destination=${destination}`,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
