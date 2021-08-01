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
// import { GetStaticProps, GetStaticPaths } from 'next';
// import { ParsedUrlQuery } from 'node:querystring';

// components
import { Header } from '../../components/layout/index';
import { PageTitle } from '../../components/atoms/index';

const AdminDashboard: FC<AdminServerSideProps> = ({ user, token }) => {
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
  return adminServerSideProps(ctx);
};

export default AdminDashboard;
