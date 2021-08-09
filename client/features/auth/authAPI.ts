import axios from 'axios';
import { API } from '../../config/config';

interface RegisterUserAPITypes {
  name: string;
  email: string;
  password: string;
  categories: string[];
}

interface UpdateUserAPITypes {
  name: string;
  email: string;
  categories: string[];
  token:string
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
  password,
  categories
}: RegisterUserAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ name, email, password, categories });

  return axios.post(`${API}/auth/register`, body, config);
};

export const updateUserAPI = ({
  name,
  email,
  categories,
  token
}: UpdateUserAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
    }
  };
  const body = JSON.stringify({ name, email, categories });

  return axios.put(`${API}/user`, body, config);
};

export const activateUserAPI = (token: string) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ token });

  return axios.post(`${API}/auth/register/activate`, body, config);
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

export const resetPasswordAPI = ({
  newPassword,
  token
}: ResetPasswordAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ newPassword, token });

  return axios.patch(`${API}/auth/reset-password`, body, config);
};
