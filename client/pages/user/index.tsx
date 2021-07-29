import React, { FC, useEffect } from 'react';
import axios from 'axios';
import { publicRuntimeConfig } from '../../next.config';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';

// helper function
import { getCokkie } from '../../helpers/storageToken';
import { isAxiosError } from '../../helpers/axiosError';
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
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  try {
    const response = await axios.get(`${publicRuntimeConfig.API}/user`, config);
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
          }
        };
      }
    }
  }
};

// const UserDashboard: FC<UserDashboardProps> = ({ todos }) => {
//   return <Header>{JSON.stringify(todos)}</Header>;
// };

// interface Params extends ParsedUrlQuery {
//   id: string;
// }
// export const getServerSideProps = async () => {
//   console.log('getServerSideProps');
//   const response = await axios.get(
//     'https://jsonplaceholder.typicode.com/todos'
//   );
//   return {
//     props: {
//       todos: response.data
//     } // will be passed to the page component as props
//   };
// };

export default UserDashboard;
