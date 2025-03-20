import {
  IAccessPointInputs,
  ICreateAgentPayload,
  INotificationPayload,
  IUpdateAccessPointInputs,
  IUpdateAgentPayload,
} from '../common/interfaces';
import axiosClient from '../utils/axiosClient';

export async function getAdminVehicles(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const res = await axiosClient.get(
      `/api/v1/vehicle/admin?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function changeVehicleStatus(statusPayload: {
  id: number;
  status: boolean;
}) {
  try {
    const res = await axiosClient.patch(
      `/api/v1/vehicle/admin/${statusPayload.id}?isActive=${statusPayload.status}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAdminCustomers(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const res = await axiosClient.get(
      `/api/v1/customer/admin?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function changeCustomerStatus(statusPayload: {
  id: number;
  status: boolean;
}) {
  try {
    const res = await axiosClient.patch(
      `/api/v1/customer/admin/${statusPayload.id}?isActive=${statusPayload.status}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createAccessPoint(payload: IAccessPointInputs) {
  try {
    const res = await axiosClient.post(`/api/v1/access-point/admin`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateAccessPoint(payload: IUpdateAccessPointInputs) {
  try {
    const res = await axiosClient.post(`/api/v1/access-point/admin`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAdminAccessPoints(
  page?: number,
  limit?: number,
  search?: string,
) {
  const p = page || 0;
  const l = limit || 100000;
  const s = search || '';
  try {
    const res = await axiosClient.get(
      `/api/v1/access-point/admin?page=${p}&size=${l}&searchKey=${s}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function sendNotification(payload: INotificationPayload) {
  try {
    const res = await axiosClient.post(
      `/api/v1/notification/admin/publish`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAdminNotifications(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const res = await axiosClient.get(
      `/api/v1/notification/admin?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createAgent(payload: ICreateAgentPayload) {
  try {
    const res = await axiosClient.post(`/api/v1/agent/admin`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateAgent(payload: IUpdateAgentPayload) {
  try {
    const res = await axiosClient.put(`/api/v1/agent/admin`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAgents(page: number, limit: number, search: string) {
  try {
    const res = await axiosClient.get(
      `/api/v1/agent/admin?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getOngoingVehicles() {
  try {
    const res = await axiosClient.get(
      `/api/v1/transaction/admin/status?status=ENTERED`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getMapData() {
  try {
    const res = await axiosClient.get(`/api/v1/transaction/admin/live-count`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadFareSheet(file: File, category: string) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axiosClient.post(
      `/api/v1/transaction/fare/admin/upload?category=${category}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getTransactionsAdmin(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const res = await axiosClient.get(
      `/api/v1/transaction/admin?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getFareData(
  page: number,
  limit: number,
  category: string,
  source: string,
  destination: string,
) {
  try {
    const cat = category ? `&category=${category}` : '';
    const sour = source ? `&source=${source}` : '';
    const dest = destination ? `&destination=${destination}` : '';
    const res = await axiosClient.get(
      `/api/v1/transaction/fare/admin?page=${page}&size=${limit}${cat}${sour}${dest}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function downloadPDF(type: string) {
  try {
    const res = await axiosClient.get(`api/v1/${type}/admin/report/download`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function downloadTransactionPDF(
  start: string,
  end: string,
  vn: string,
) {
  try {
    const vehiNum = vn ? `&vehicleNumber=${vn}` : '';
    const res = await axiosClient.get(
      `api/v1/transaction/admin/report/download?start=${start}&end=${end}${vehiNum}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
