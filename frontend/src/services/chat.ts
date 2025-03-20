import axiosClient from '../utils/axiosClient';

export async function getChatHistory() {
  try {
    const res = await axiosClient.get(`api/v1/chat?page=0&size=1000`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
