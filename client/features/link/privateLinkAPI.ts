import axios from 'axios';
import { API } from '../../config/config';
import { isAuth } from '../../helpers/storageToken';

interface DeletePrivateLinkAPITypes {
  privateLinkId: string;
  token: string;
}
interface UpdatePrivateLinkAPITypes {
  privateLinkId: string;
  token: string;
  title: string;
  url: string;
  categories: string[];
  type: string;
  medium: string;
}

export const deletePrivateLinkAPI = ({
  privateLinkId,
  token
}: DeletePrivateLinkAPITypes) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  return axios.delete(`${API}/link/${privateLinkId}`, config);
};

export const updatePrivateLinkAPI = ({
  privateLinkId,
  token,
  title,
  url,
  categories,
  type,
  medium
}: UpdatePrivateLinkAPITypes) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const data = { title, url, categories, type, medium };

  if (isAuth() && isAuth().role === 'admin') {
    return axios.put(`${API}/link/admin/${privateLinkId}`, data, config);
  } else {
    return axios.put(`${API}/link/${privateLinkId}`, data, config);
  }
};
