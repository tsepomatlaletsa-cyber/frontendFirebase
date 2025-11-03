import axios from "axios";

const API = axios.create({
  baseURL: "https://backendfirebase-a1f4.onrender.com/api", // backend
});

export default API;
