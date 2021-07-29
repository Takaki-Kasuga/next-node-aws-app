// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import React, { FC } from 'react';

// components
import { Header } from '../components/layout/index';

import { getCokkie } from '../helpers/storageToken';

const Home: FC = () => {
  console.log("getCokkie('token')", getCokkie('token'));
  return <Header>Next/Hello</Header>;
};

export default Home;
