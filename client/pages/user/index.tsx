import React, { FC, useEffect } from 'react';
import axios from 'axios';
import { publicRuntimeConfig } from '../../next.config';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';

// helper function

import { getCokkie } from '../../helpers/storageToken';
import { isAxiosError } from '../../helpers/axiosError';
import { userServerSideProps } from '../../helpers/userServerSideProps';

// components
import { Header } from '../../components/layout/index';

interface UserDashboardProps {
  user: {
    role: string;
    _id: string;
    username: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
  userLinks: [];
}

const UserDashboard: FC<any> = ({ user, userLinks }) => {
  return <Header>{JSON.stringify(userLinks)}</Header>;
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  // if have not token on cookie
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
  try {
    const response = await axios.get(`${publicRuntimeConfig.API}/user`, config);
    // control auth and routing

    console.log('response user', response.data);
    return {
      props: {
        user: response.data.user,
        userLinks: response.data.links,
        token
      }
    };
  } catch (error) {
    console.log('エラーが起きています。');
    if (isAxiosError(error)) {
      if (error.response!.status === 401) {
        return {
          props: {
            user: 'No user',
            token
          },
          redirect: {
            destination: '/',
            permanent: false
          }
        };
      }
    } else {
      return {
        props: {
          user: 'No user',
          token
        },
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }
  }
};

export default UserDashboard;
