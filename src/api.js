import axios from "axios";

const API = axios.create({
  baseURL: "https://bak2.onrender.com/api", // backend
});

export default API;
