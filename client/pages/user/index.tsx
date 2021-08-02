import React, { FC, useEffect } from 'react';
import axios from 'axios';
import { publicRuntimeConfig } from '../../next.config';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';

// helper function
import { getCokkie } from '../../helpers/storageToken';
import { isAxiosError } from '../../helpers/axiosError';
import { userServerSideProps } from '../../helpers/userServerSideProps';
// import { GetStaticProps, GetStaticPaths } from 'next';
// import { ParsedUrlQuery } from 'node:querystring';

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
}

const UserDashboard: FC<UserDashboardProps | { user: string }> = ({ user }) => {
  return <Header>{JSON.stringify(user)}</Header>;
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  userServerSideProps(ctx);
};

export default UserDashboard;
