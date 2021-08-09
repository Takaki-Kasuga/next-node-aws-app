import React, { FC, useEffect, Fragment } from 'react';
import { useAppDispatch } from '../app/hooks';
import { useRouter } from 'next/router';
import axios from 'axios';

// components
import { Header } from '../components/layout/index';
import { InputText } from '../components/forms/index';
import { ErrorMessage } from '../components/styles/index';
import { PageTitle } from '../components/atoms/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// slice
import { registerUserAsync } from '../features/auth/authSlice';

// helper function
import { isAuth } from '../helpers/storageToken';
import { API } from '../config/config';

interface RegisterProps {
  categories: {
    image: {
      url: string;
      key: string;
    };
    _id: string;
    name: string;
    content: string;
    slug: string;
    postedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}

interface RegisterFormType {
  name: string;
  email: string;
  password: string;
  categories: string[];
}

const Register: FC<RegisterProps> = ({ categories }) => {
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
    reset();
    dispatch(registerUserAsync(formData));
  };

  useEffect(() => {
    isAuth() && router.push('/');
  }, [router]);

  return (
    <Header>
      <PageTitle>Register</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>
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
        <h3 className='text-gray-500 mb-5'>Categories</h3>
        <ul className='max-h-72 overflow-scroll'>
          {categories.length > 0
            ? categories.map((category, index) => {
                return (
                  <Fragment key={index}>
                    <li className='mb-3 '>
                      <input
                        value={category._id}
                        {...register('categories', {
                          required: 'Please check the category'
                        })}
                        id={category.slug}
                        type='checkbox'
                        className='mr-3'
                      />
                      <label htmlFor={category.slug}>{category.name}</label>
                    </li>
                  </Fragment>
                );
              })
            : null}
        </ul>
        {/* {errors.categories && (
          <ErrorMessage>{errors.categories.message}</ErrorMessage>
        )} */}
        <button
          type='submit'
          className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
          Register
        </button>
      </form>
    </Header>
  );
};

export const getStaticProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    props: {
      categories: response.data.categories
    },
    revalidate: 3600
  };
};

export default Register;
