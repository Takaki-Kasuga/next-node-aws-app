import next from 'next';
import React, { FC, Fragment } from 'react';

// Next.js
import Link from 'next/link';

interface HeaderProps {
  children: string;
}

const Header: FC<HeaderProps> = ({ children }) => {
  return (
    <Fragment>
      <ul className='flex bg-blue-500 px-4'>
        <li className='mr-6'>
          <Link href='/'>
            <a className='text-blue-50 hover:text-blue-800'>Home</a>
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
