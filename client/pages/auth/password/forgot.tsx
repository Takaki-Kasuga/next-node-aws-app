import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { useRouter } from 'next/router';

// components
import { Header } from '../../../components/layout/index';
import { InputText } from '../../../components/forms/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// slice
import { forgotPasswordAsync } from '../../../features/auth/authSlice';

// helper function
import { isAuth } from '../../../helpers/storageToken';

interface ForgotPasswordFormType {
  email: string;
}

const ForgotPassword: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ForgotPasswordFormType>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = (formData) => {
    dispatch(forgotPasswordAsync(formData));
    reset();
  };

  useEffect(() => {
    isAuth() && router.push('/');
  }, [router]);

  return (
    <Header>
      <h1 className='text-center text-2xl  font-serif text-blue-700'>
        Forgot Password
      </h1>
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
        {/* {JSON.stringify(isAuth())} */}
        <button
          type='submit'
          className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
          ForgotPassword
        </button>
      </form>
    </Header>
  );
};

export default ForgotPassword;
