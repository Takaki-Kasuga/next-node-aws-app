import React, { FC, useEffect, Fragment } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next';
import axios from 'axios';
// components
import { Header } from '../../../components/layout/index';
import { InputText } from '../../../components/forms/index';
import { ErrorMessage } from '../../../components/styles/index';
import { PageTitle } from '../../../components/atoms/index';
// import { BlueButton } from '../../../components/styles/index';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';

// slice
import { updateUserAsync } from '../../../features/auth/authSlice';

// helper function
import { isAuth } from '../../../helpers/storageToken';
import { API } from '../../../config/config';
import { getCokkie } from '../../../helpers/storageToken';
import { isAxiosError } from '../../../helpers/axiosError';

interface UpdateProfileProps {
  user: {
    categories: string[];
    role: string;
    _id: string;
    username: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
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
  token: string;
}

interface RegisterFormType {
  name: string;
  email: string;
  categories: string[];
}

const UpdateProfile: FC<UpdateProfileProps> = ({ categories, user, token }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormType>({
    mode: 'onBlur',
    defaultValues: {
      name: typeof user !== 'string' ? user.name : user,
      email: typeof user !== 'string' ? user.email : ''
      // password: typeof user !== 'string' ? user.password : ''
    }
  });

  const onSubmit: SubmitHandler<RegisterFormType> = (formData) => {
    interface Token {
      token: string;
    }
    const newFormData = { ...formData, token };
    dispatch(updateUserAsync(newFormData));
  };

  return (
    <Header>
      <PageTitle>Update Profile</PageTitle>
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
            disabled={true}
            register={register('email', {
              required: 'Please input your email address'
            })}>
            Email adress（You cannnot change）
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
                        {...register('categories')}
                        defaultChecked={user.categories.some((item) => {
                          return item === category._id;
                        })}
                        value={category._id}
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
          className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
          type='submit'>
          Register
        </button>
      </form>
    </Header>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  // if have not token on cookie
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
  try {
    // control auth and routing
    const response = await axios.get(`${API}/user`, config);
    const allCategories = await axios.get(`${API}/categories`, config);

    return {
      props: {
        categories: allCategories.data.categories,
        user: response.data.user,
        token
      }
    };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response!.status === 401) {
        return {
          props: {
            user: 'No user',
            token
          },
          redirect: {
            destination: '/',
            permanent: false
          }
        };
      }
    }
  }
};

export default UpdateProfile;
