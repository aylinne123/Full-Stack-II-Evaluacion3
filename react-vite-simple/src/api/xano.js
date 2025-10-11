// src/api/xano.js
import axios from "axios";

// Usa la variable de entorno VITE_XANO_BASE_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_XANO_BASE_URL,
});

export default api;
