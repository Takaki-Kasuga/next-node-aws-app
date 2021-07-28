import axios from 'axios';
import { API } from '../../config/config';

interface RegisterUserAPITypes {
  name: string;
  email: string;
  password: string;
}

export const registerUserAPI = ({
  name,
  email,
  password
}: RegisterUserAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ name, email, password });

  return axios.post(`${API}/auth/register`, body, config);
};
