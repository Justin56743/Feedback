import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = {
  register: (data: any) => axios.post(`${API_URL}/register`, data),
  login: (data: any) => axios.post(`${API_URL}/login`, data),
  getFeedbacks: (token: string) =>
    axios.get(`${API_URL}/feedback`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createFeedback: (data: any, token: string) =>
    axios.post(`${API_URL}/feedback`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  editFeedback: (id: number, data: any, token: string) =>
    axios.patch(`${API_URL}/feedback/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteFeedback: (id: number, token: string) =>
    axios.delete(`${API_URL}/feedback/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};