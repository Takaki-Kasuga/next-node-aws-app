import React, { FC, useState, useEffect } from 'react';

import { useRouter } from 'next/router';

// components
import { Header } from '../../../components/layout';

// npm package
import jwt from 'jsonwebtoken';

interface RegisterToken {
  email: string;
  exp: number;
  iat: number;
  name: string;
  password: string;
}

const ActivateAccount: FC<{ router: string }> = () => {
  const router = useRouter();
  const [state, setState] = useState({
    name: '',
    token: ''
  });
  console.log('router', router);

  useEffect(() => {
    let token = router.query.token as string | undefined;
    if (token) {
      const decodedToken = jwt.decode(token) as RegisterToken;
      console.log('decodedToken', decodedToken);
      setState({ ...state, name: decodedToken.name });
    }
  }, [router]);

  const activateAccount = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    // token dispatch to http://localhost:8000/api/auth/register/activate
  };

  return (
    <Header>
      <div className='container'>
        <div>
          <h1 className='text-2xl mb-5 font-serif text-blue-500 text-center'>
            Good Day {state.name}, Ready to activate your account?
          </h1>
        </div>
        <button
          onClick={(e) => {
            activateAccount(e);
          }}
          className='w-9/12 block m-auto bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
          Activate Account
        </button>
      </div>
    </Header>
  );
};

export default ActivateAccount;
