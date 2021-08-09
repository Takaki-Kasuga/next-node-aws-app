import next from 'next';
import React, { FC, Fragment, useEffect, ReactNode } from 'react';

// Next.js
import Head from 'next/head';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

// components
import { DangerAlert, SuccessAlert } from '../helpers/index';

// npm package
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// helper function
import { isAuth, logout } from '../../helpers/storageToken';

interface HeaderProps {
  children: string | ReactNode;
}

const handleStart = (url: string) => {
  NProgress.start();
};
const handleStop = () => {
  NProgress.done();
};

const Header: FC<HeaderProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
  return (
    <Fragment>
      <Head>
        <link
          rel='stylesheet'
          type='text/css'
          href='/static/css/progress.css'
        />
      </Head>
      <ul className='flex bg-blue-500 p-4'>
        <li className='mr-6'>
          <Link href='/'>
            <a className='text-blue-50 hover:text-blue-800 '>Home</a>
          </Link>
        </li>

        {!isAuth() ? (
          <Fragment>
            <li className='mr-6'>
              <Link href='/login'>
                <a className='text-blue-50 hover:text-blue-800'>Login</a>
              </Link>
            </li>
            <li className='mr-6'>
              <Link href='/register'>
                <a className='text-blue-50 hover:text-blue-800'>Register</a>
              </Link>
            </li>
          </Fragment>
        ) : null}

        {isAuth() && isAuth().role === 'admin' ? (
          <Fragment>
            <li className='mr-6'>
              <Link href='/user/link/create'>
                <a className='text-blue-50 hover:text-blue-800 '>
                  Submit a Link
                </a>
              </Link>
            </li>
            <li className='mr-6'>
              <Link href='/admin'>
                <a className='text-blue-50 hover:text-blue-800'>
                  Admin: {isAuth().name}
                </a>
              </Link>
            </li>
          </Fragment>
        ) : null}
        {isAuth() && isAuth().role === 'subscriber' ? (
          <Fragment>
            <li className='mr-6'>
              <Link href='/user'>
                <a className='text-blue-50 hover:text-blue-800'>
                  User: {isAuth().name}
                </a>
              </Link>
            </li>
            <li className='mr-6'>
              <Link href='/user/link/create'>
                <a className='text-blue-50 hover:text-blue-800 '>
                  Submit a Link
                </a>
              </Link>
            </li>
          </Fragment>
        ) : null}
        {isAuth() ? (
          <Fragment>
            <li className='mr-6'>
              <a onClick={logout} className='text-blue-50 hover:text-blue-800'>
                Logout
              </a>
            </li>
          </Fragment>
        ) : null}
      </ul>
      <DangerAlert />
      <SuccessAlert />
      <div className='container mx-auto p-5 break-all'>{children}</div>
    </Fragment>
  );
};

export default Header;
