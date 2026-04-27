import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 👉 login
export const loginApi = (data: {
  identifier: string;
  password: string;
}) => {
  return API.post('/auth/login', data);
};

export default API;