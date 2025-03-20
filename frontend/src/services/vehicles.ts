import axiosClient from '../utils/axiosClient';
import { BreakDownPayload, IVehiclePayload } from '../common/interfaces';

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

export async function getVehicles(
  page: number,
  limit: number,
  search: string,
  mail: string,
) {
  try {
    const res = await axiosClient.get(
      `/api/v1/vehicle?page=${page}&size=${limit}&searchKey=${search}&email=${mail}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getVehicleTypes() {
  try {
    const res = await axiosClient.get(`/api/v1/vehicle/vehicle-types`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getBrands() {
  try {
    const res = await axiosClient.get(`/api/v1/vehicle/brands`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getFuelTypes() {
  try {
    const res = await axiosClient.get(`/api/v1/vehicle/fuel-types`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createVehicle(payload: IVehiclePayload) {
  try {
    const res = await axiosClient.post(`/api/v1/vehicle`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getVehicle(registrationNumber: string) {
  try {
    const res = await axiosClient.get(
      `api/v1/vehicle/registration-number?registrationNumber=${registrationNumber}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateVehicle(payload: IVehiclePayload, id: number) {
  try {
    const body = {
      ...payload,
      id,
    };
    const res = await axiosClient.put(`/api/v1/vehicle`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getCustomerTransactions(
  page: number,
  limit: number,
  search: string,
  mail: string,
) {
  try {
    const res = await axiosClient.get(
      `/api/v1/transaction?page=${page}&size=${limit}&searchKey=${search}&email=${mail}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function reportBreakdown(payload: BreakDownPayload) {
  try {
    const res = await axiosClient.post(
      `/api/v1/transaction/breakdown?vehicleNumber=${payload.vehicleNumber}&description=${payload.description}&lon=${payload.lon}&lat=${payload.lat}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
