import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://172.16.1.17:3065/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
