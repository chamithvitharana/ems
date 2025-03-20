import { SignupFormPayload } from '../common/interfaces';
import axiosClient from '../utils/axiosClient';

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export async function getTransactionDetails(regNum: string) {
  try {
    const res = await axiosClient.get(
      `/api/v1/transaction/vehicle-number?vehicleNumber=${regNum}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function startTransaction(regNum: string, accessPointID: string) {
  try {
    const res = await axiosClient.post(
      `/api/v1/transaction?vehicleNumber=${regNum}&accessPointId=${accessPointID}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function manualPayment(id: string) {
  try {
    const res = await axiosClient.post(
      `/api/v1/transaction/manual/complete/${id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getCustomerNotifications(page: number, limit: number) {
  try {
    const res = await axiosClient.get(
      `/api/v1/notification/customer?page=${page}&size=${limit}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAgentNotifications(page: number, limit: number) {
  try {
    const res = await axiosClient.get(
      `/api/v1/notification/agent?page=${page}&size=${limit}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(payload: SignupFormPayload) {
  try {
    const response = await axiosClient.post(
      '/api/v1/auth/customer/update',
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
