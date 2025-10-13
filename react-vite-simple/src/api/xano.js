import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_XANO_BASE_URL,
});

export default api;
