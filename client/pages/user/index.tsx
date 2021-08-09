import React, { FC, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import axios from 'axios';
import { publicRuntimeConfig } from '../../next.config';
import { NextPageContext } from 'next';
import Link from 'next/link';

// slice
import {
  addPrivateLink,
  deletePrivateLinkAsync,
  privateLinkStateSlice
} from '../../features/link/privateLinkSlice';

// npm package
import moment from 'moment';

// helper function
import { getCokkie } from '../../helpers/storageToken';
import { isAxiosError } from '../../helpers/axiosError';

// components
import { Header } from '../../components/layout/index';
import { PageTitle } from '../../components/atoms';
const DynamicLoadingSpinner = dynamic(
  () => import('../../components/helpers/LoadingSpinner')
);

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
  const dispatch = useAppDispatch();
  const privateLink = useAppSelector(privateLinkStateSlice);

  useEffect(() => {
    dispatch(addPrivateLink(userLinks));
  }, [dispatch, userLinks]);

  const confirmDelete = (linkId: string) => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deletePrivateLinkAsync({ privateLinkId: linkId, token }));
    }
  };
  return (
    <Header>
      <PageTitle>
        {user.name}s Dashboard /{' '}
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

          {privateLink.privateLinks.length === 0 ? (
            <h1>No Post Links</h1>
          ) : (
            privateLink.privateLinks.map((link, index) => {
              return (
                <article className='bg-blue-200 p-5 rounded mb-5' key={index}>
                  <div className='md:flex md:justify-between md:items-center mb-5'>
                    <div className='md:w-8/12'>
                      <a
                        className='text-blue-600 hover:text-white hover:underline'
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'>
                        <h5>{link.title}</h5>
                        <h6>{link.url}</h6>
                      </a>
                    </div>
                    <div className='md:w-3/12'>
                      <span className='block'>
                        {moment(link.createdAt).fromNow()} /{' '}
                        {link.postedBy.name}
                      </span>
                      <span className='block'>{link.clicks} clicks</span>
                    </div>
                  </div>
                  <div className='md:flex md:justify-between md:items-center'>
                    <div className='md:w-8/12'>
                      <span className='md:mr-5'>
                        {link.type} / {link.medium}
                      </span>
                      {link.categories.map((category, index) => {
                        return (
                          <span key={index} className='mr-3'>
                            {category.name}
                          </span>
                        );
                      })}
                    </div>
                    <div className='md:w-3/12'>
                      <Link href={`/user/link/${link._id}`}>
                        <a className='inline-block bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded'>
                          Update
                        </a>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          confirmDelete(link._id);
                        }}
                        className='inline-block bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
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

    return {
      props: {
        user: response.data.user,
        userLinks: response.data.links,
        token
      }
    };
  } catch (error) {
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
