import React, { FC, useEffect } from 'react';
import axios from 'axios';
import { publicRuntimeConfig } from '../../next.config';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';
import Link from 'next/link';

// helper function
import { getCokkie } from '../../helpers/storageToken';
import { isAxiosError } from '../../helpers/axiosError';
// import { GetStaticProps, GetStaticPaths } from 'next';
// import { ParsedUrlQuery } from 'node:querystring';

// components
import { Header } from '../../components/layout/index';
import { PageTitle } from '../../components/atoms/index';

interface AdminDashboardProps {
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
}

const AdminDashboard: FC<AdminDashboardProps | { user: string }> = ({
  user
}) => {
  return (
    <Header>
      {JSON.stringify(user)}
      <PageTitle>Admin Dashboard</PageTitle>
      <div className='flex'>
        <div className='w-3/12'>
          <ul>
            <li>
              <Link href='/admin/category/create'>
                <a className='primary-btn'>Create Category</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='w-9/12'></div>
      </div>
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

export default AdminDashboard;
