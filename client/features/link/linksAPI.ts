import axios from 'axios';
import { API } from '../../config/config';

interface DeleteLinkAPITypes {
  linkId: string;
  token: string;
}

export const deleteLinkAPI = ({ linkId, token }: DeleteLinkAPITypes) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  return axios.delete(`${API}/link/admin/${linkId}`, config);
};
