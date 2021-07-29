import React, { FC } from 'react';
import axios from 'axios';
import { NextPageContext } from 'next';
import { getCokkie } from '../helpers/storageToken';
import { isAxiosError } from '../helpers/axiosError';
import { publicRuntimeConfig } from '../next.config';

let user = null;

const withUser = (Page: FC) => {
  const WithAuthUser: FC = (props) => {
    return <Page {...props} />;
  };
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  if (token) {
    try {
      const response = await axios.get(
        `${publicRuntimeConfig.API}/user`,
        config
      );
      user = response.data.user;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response!.status === 401) {
          user = null;
        }
      }
    }
  }
  if ((user = null)) {
    return {
      // redirect
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  } else {
    return {
      props: {}
    };
  }
};

export default withUser;
