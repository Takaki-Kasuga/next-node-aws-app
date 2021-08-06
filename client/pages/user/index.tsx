import React, { FC, useEffect } from 'react';
import axios from 'axios';
import { publicRuntimeConfig } from '../../next.config';
import { NextPageContext } from 'next';
import Link from 'next/link';

// npm package
import moment from 'moment';

// helper function
import { getCokkie } from '../../helpers/storageToken';
import { isAxiosError } from '../../helpers/axiosError';

// components
import { Header } from '../../components/layout/index';
import { PageTitle } from '../../components/atoms';

interface DashboardProps {
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
  userLinks: {
    categories: { _id: string; name: string }[];
    type: string;
    medium: string;
    clicks: number;
    _id: string;
    title: string;
    url: string;
    slug: string;
    postedBy: {
      _id: string;
      username: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  token: string;
}

const UserDashboard: FC<DashboardProps> = ({ user, userLinks, token }) => {
  return (
    <Header>
      <PageTitle>
        {user.name}'s Dashboard /{' '}
        <span className='text-red-500'>{user.role}</span>
      </PageTitle>
      <div className='md:grid md:grid-cols-4 md:gap-4'>
        <div>
          <Link href='/user/link/create'>
            <a className='inline-block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
              Submit a Link
            </a>
          </Link>
          <Link href='/user/profile/update'>
            <a className='inline-block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
              Update Profile
            </a>
          </Link>
        </div>
        <div className='md:col-span-3'>
          <h2>Your Links</h2>

          {userLinks.map((link, index) => {
            return (
              <div className='md:grid md:grid-cols-4 md:gap-4' key={index}>
                <div className='md:col-span-3'>
                  <a
                    className='text-blue-600 hover:text-blue-300 hover:underline'
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h5>{link.title}</h5>
                    <h6>{link.url}</h6>
                  </a>
                </div>
                <div>
                  <span>
                    {moment(link.createdAt).fromNow()} / {link.postedBy.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
