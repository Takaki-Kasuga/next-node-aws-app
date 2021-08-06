import React, { FC } from 'react';

const PageTitle: FC<{
  children: string | React.ReactNode | (string & React.ReactNode);
}> = ({ children }) => {
  return (
    <h1 className='text-center text-2xl  font-serif text-blue-700'>
      {children}
    </h1>
  );
};

export default PageTitle;
