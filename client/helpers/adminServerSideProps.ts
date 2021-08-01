import axios from 'axios';
import { NextPageContext } from 'next';

// helper function
import { getCokkie } from './storageToken';
import { publicRuntimeConfig } from '../next.config';
import { isAxiosError } from './axiosError';

export interface AdminServerSideProps {
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

export const adminServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(
      `${publicRuntimeConfig.API}/admin`,
      config
    );
    // control auth and routing
    if (response.data.user.role !== 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }
    return {
      props: {
        user: response.data.user,
        token
      }
    };
  } catch (error) {
    console.log('エラーが起きています。');
    if (isAxiosError(error)) {
      if (error.response!.status === 401) {
        return {
          props: {
            user: 'No admin',
            token
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
