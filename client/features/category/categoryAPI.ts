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
