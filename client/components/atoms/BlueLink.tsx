import React from 'react';

const BlueLink: FC<{ children: string }> = ({ children }) => {
  return (
    <a className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
      {children}
    </a>
  );
};

export default BlueLink;
