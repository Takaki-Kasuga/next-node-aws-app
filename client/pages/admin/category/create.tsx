import React, { FC } from 'react';
import axios from 'axios';
import { publicRuntimeConfig } from '../../../next.config';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';
import Link from 'next/link';

// helper function
import { getCokkie } from '../../../helpers/storageToken';
import { isAxiosError } from '../../../helpers/axiosError';

// components
import { PageTitle } from '../../../components/atoms/index';
import { Header } from '../../../components/layout/index';

const Create: FC = () => {
  return (
    <Header>
      <PageTitle>Create Category</PageTitle>
    </Header>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`${publicRuntimeConfig.API}/user`, config);
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
        user: response.data.user
      }
    };
  } catch (error) {
    console.log('エラーが起きています。');
    if (isAxiosError(error)) {
      if (error.response!.status === 401) {
        return {
          props: {
            user: 'No admin'
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

export default Create;
