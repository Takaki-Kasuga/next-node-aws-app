import React, { FC, Fragment } from 'react';
import Image from 'next/image';

import loadingPackman from '../../assets/loadingPackman.gif';
import loadingText from '../../assets/loadingText.gif';

const Loading: FC = () => {
  return (
    <div className='mt-5 text-center'>
      <figure>
        <Image src={loadingText} alt='loading...' />
      </figure>
      <figure>
        <Image src={loadingPackman} alt='loading...' />
      </figure>
    </div>
  );
};

export default Loading;
