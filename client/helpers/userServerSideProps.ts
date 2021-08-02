import axios from 'axios';
import { NextPageContext } from 'next';

// helper function
import { getCokkie } from './storageToken';
import { publicRuntimeConfig } from '../next.config';
import { isAxiosError } from './axiosError';

export interface UserServerSideProps {
  user:
    | {
        role: string;
        _id: string;
        username: string;
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
      }
    | string;
  token: string | undefined;
}

export const userServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  try {
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const response = await axios.get(`${publicRuntimeConfig.API}/user`, config);
    // control auth and routing

    return {
      props: {
        user: response.data.user
      }
    };
  } catch (error) {
    console.log('エラーが起きています。');
    if (isAxiosError(error)) {
      if (error.response!.status === 401) {
        return {
          props: {
            user: 'No user'
          },
          redirect: {
            destination: '/',
            permanent: false
          }
        };
      }
    }
  }
};
