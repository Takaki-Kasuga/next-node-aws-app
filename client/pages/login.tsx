import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';

// components
import { Header } from '../components/layout/index';
import { InputText } from '../components/forms/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// slice
import { loginUserAsync } from '../features/auth/authSlice';

// helper function
import { isAuth } from '../helpers/storageToken';

interface LoginFormType {
  email: string;
  password: string;
}

const Login: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<LoginFormType>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<LoginFormType> = (formData) => {
    console.log('通過しました。');
    console.table(formData);
    reset();
    dispatch(loginUserAsync(formData));
  };

  useEffect(() => {
    isAuth() && router.push('/');
  }, [router]);

  return (
    <Header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
          <InputText
            id='email'
            inputType='text'
            placeholder='Email address'
            error={errors.email!}
            register={register('email', {
              required: 'Please input your email address'
            })}>
            Email adress
          </InputText>
        </div>
        {JSON.stringify(isAuth())}
        <div className='mb-4'>
          <InputText
            id='password'
            inputType='password'
            placeholder='Password'
            error={errors.password!}
            register={register('password', {
              required: 'Please input your password',
              minLength: {
                value: 6,
                message: 'Please set password more than equal 6 characters'
              },
              validate: (value) => {
                return (
                  value.replace(/\s+/g, '').length >= 6 ||
                  'Do not enter blank space. Please set password more than  equal 6 characters'
                );
              }
            })}>
            Password
          </InputText>
        </div>
        <div className='flex justify-between mt-10'>
          <button
            type='submit'
            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
            Login
          </button>
          <Link href='/auth/password/forgot'>
            <a className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-3 px-4 border border-red-500 hover:border-transparent rounded'>
              ForgotPassword
            </a>
          </Link>
        </div>
      </form>
    </Header>
  );
};

export default Login;
