import React, { FC } from 'react';
import Image from 'next/image';
import loadingSpinnerpx from '../../assets/loadingSpinnerpx.gif';

const LoadingSpinner: FC = () => {
  return <Image src={loadingSpinnerpx} alt='loading...' />;
};

export default LoadingSpinner;
