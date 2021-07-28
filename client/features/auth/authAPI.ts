import axios from 'axios';

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

  return axios.post('http://localhost:8000/api/auth/register', body, config);
};
