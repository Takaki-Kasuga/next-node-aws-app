import axios from 'axios';
import { API } from '../../config/config';

interface addCategoryAPITypes {
  name: string;
  content: string;
  image: any;
  token: string;
}

export const addCategoryAPI = ({
  name,
  content,
  image,
  token
}: addCategoryAPITypes) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  };

  const body = new FormData();
  body.append('name', name);
  body.append('content', content);
  body.append('image', image);

  console.log('body', body);

  return axios.post(`${API}/category`, body, config);
};

export const getCategoriesAPI = () => {
  return axios.get(`${API}/categories`);
};

export const deleteCategoriesAPI = ({
  slug,
  token
}: {
  slug: string;
  token: string;
}) => {
  console.log('token', token);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  console.log('ここまできています');
  console.log('slug', slug);
  return axios.delete(`${API}/category/${slug}`, config);
};
