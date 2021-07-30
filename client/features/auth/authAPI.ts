import axios from 'axios';
import { API } from '../../config/config';

interface RegisterUserAPITypes {
  name: string;
  email: string;
  password: string;
}
interface LoginUserAPITypes {
  email: string;
  password: string;
}
interface ForgotPasswordAPITypes {
  email: string;
}

interface ResetPasswordAPITypes {
  newPassword: string;
  token: string;
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

export const loginUserAPI = ({ email, password }: LoginUserAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });

  return axios.post(`${API}/auth/login`, body, config);
};

export const forgotPasswordAPI = ({ email }: ForgotPasswordAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email });

  return axios.patch(`${API}/auth/forgot-password`, body, config);
};

export const resetPasswordAPI = ({ newPassword,token }: ResetPasswordAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ newPassword, token });

  return axios.patch(`${API}/auth/reset-password`, body, config);
};
