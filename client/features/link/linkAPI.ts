import axios from 'axios';
import { API } from '../../config/config';

interface CreateLinkAPITypes {
  title: string;
  url: string;
  categories: string[];
  type: string;
  medium: string;
  token: string;
}

export const createLinkAPI = ({
  title,
  url,
  categories,
  type,
  medium,
  token
}: CreateLinkAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const body = JSON.stringify({
    title,
    url,
    categories,
    type,
    medium
  });

  return axios.post(`${API}/link`, body, config);
};
