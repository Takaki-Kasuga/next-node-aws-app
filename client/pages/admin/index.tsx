import React, { FC, useEffect } from 'react';
import { publicRuntimeConfig } from '../../next.config';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';
import Link from 'next/link';

// helper function
import {
  adminServerSideProps,
  AdminServerSideProps
} from '../../helpers/adminServerSideProps';

// components
import { Header } from '../../components/layout/index';
import { PageTitle } from '../../components/atoms/index';

const AdminDashboard: FC<AdminServerSideProps> = ({ user, token }) => {
  return (
    <Header>
      <PageTitle>Admin Dashboard</PageTitle>
      <div className='flex'>
        <div className='w-3/12'>
          <ul>
            <li className='mb-5'>
              <Link href='/admin/category/create'>
                <a className='block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                  Create Category
                </a>
              </Link>
            </li>
            <li className='mb-5'>
              <Link href='/admin/category/read'>
                <a className='block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                  All categories
                </a>
              </Link>
            </li>
            <li className='mb-5'>
              <Link href='/admin/link/read'>
                <a className='block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                  All Links
                </a>
              </Link>
            </li>
            <li className='mb-5'>
              <Link href='/user/profile/update'>
                <a className='block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                  Profile update
                </a>
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
  return adminServerSideProps(ctx);
};

export default AdminDashboard;
