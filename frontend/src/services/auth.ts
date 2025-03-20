import axios from 'axios';
import { SignupFormPayload } from '../common/interfaces';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8222',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/api/v1/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (payload: SignupFormPayload) => {
  try {
    const response = await apiClient.post(
      '/api/v1/auth/customer/sign-up',
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendResetCode = async (email: string) => {
  try {
    const response = await apiClient.post('/api/v1/auth/send-reset-code', {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string,
) => {
  try {
    const response = await apiClient.post('api/v1/auth/reset-password', {
      email,
      resetCode,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
