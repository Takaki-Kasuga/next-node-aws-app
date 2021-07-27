import next from 'next';
import React, { FC, Fragment, useEffect, ReactNode } from 'react';

// Next.js
import Head from 'next/head';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

// npm package
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

interface HeaderProps {
  children: string | ReactNode;
}

const handleStart = (url: string) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};
const handleStop = () => {
  console.log('handleStop');
  NProgress.done();
};

const Header: FC<HeaderProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      console.log('Unmounted');
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
      </ul>
      <div className='container mx-auto py-5'>{children}</div>
    </Fragment>
  );
};

export default Header;

{
  /* Import CSS for nprogress */
}
{
  /* <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.css'
        /> */
}
