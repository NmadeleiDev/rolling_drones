import axios from "axios";

export const api = axios.create({
  baseURL: `/api`,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 500,
});
