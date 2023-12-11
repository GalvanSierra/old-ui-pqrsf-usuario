import axios from "axios";

const token = window.localStorage.getItem("token");

console.log(token);
const api = axios.create({
  baseURL: "http://172.16.1.17:3065/api/v1",
  // baseURL: "http://localhost:3001/api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
