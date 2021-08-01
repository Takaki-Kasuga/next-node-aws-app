import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { useRouter } from 'next/router';

// components
import { Header } from '../components/layout/index';
import { InputText } from '../components/forms/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// slice
import { registerUserAsync } from '../features/auth/authSlice';

// helper function
import { isAuth } from '../helpers/storageToken';

interface RegisterFormType {
  name: string;
  email: string;
  password: string;
}

const Register: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormType>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<RegisterFormType> = (formData) => {
    console.log('通過しました。');
    console.table(formData);
    reset();
    dispatch(registerUserAsync(formData));
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
            id='name'
            inputType='text'
            placeholder='Your Name'
            error={errors.name!}
            register={register('name', {
              required: 'Please input your username'
            })}>
            UserName
          </InputText>
        </div>
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
                  'Do not enter blank space. Please set password more than equal 6 characters'
                );
              }
            })}>
            Password
          </InputText>
        </div>
        <button type='submit' className='primary-btn'>
          Register
        </button>
      </form>
    </Header>
  );
};

export default Register;
