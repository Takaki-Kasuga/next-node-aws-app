import axios from 'axios';
import { API } from '../../config/config';

interface AddCategoryAPITypes {
  name: string;
  content: string;
  image: any;
  token: string;
}

interface UpdateCategoryAPITypes {
  name: string;
  content: string;
  image: any;
  token: string;
  slug: string;
}

export const addCategoryAPI = ({
  name,
  content,
  image,
  token
}: AddCategoryAPITypes) => {
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

  return axios.post(`${API}/category`, body, config);
};

export const updateCategoryAPI = ({
  name,
  content,
  image,
  token,
  slug
}: UpdateCategoryAPITypes) => {
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

  return axios.put(`${API}/category/${slug}`, body, config);
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
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  return axios.delete(`${API}/category/${slug}`, config);
};
