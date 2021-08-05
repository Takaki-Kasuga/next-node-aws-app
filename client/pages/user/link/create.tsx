import React, { FC, Fragment } from 'react';
import { NextPageContext } from 'next';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import dynamic from 'next/dynamic';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import _ from 'lodash';

// components
import { Header } from '../../../components/layout/index';
import { PageTitle } from '../../../components/atoms/index';
import { InputText, InputRadio } from '../../../components/forms/index';
import { ErrorMessage } from '../../../components/styles/index';
const DynamicLoading = dynamic(
  () => import('../../../components/helpers/Loading')
);

// slice
import {
  createLinkAsync,
  linkStateSlice
} from '../../../features/link/linkSlice';

// helper function
import { getCokkie } from '../../../helpers/storageToken';

import { publicRuntimeConfig } from '../../../next.config';

interface Category {
  image: {
    url: string;
    key: string;
  };
  _id: string;
  name: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type Categories = Category[];
interface CreateProps {
  getCategories: Categories;
  token: string;
}

interface AddLinkFormType {
  title: string;
  url: string;
  categories: string[];
  type: string;
  medium: string;
}

const Create: FC<CreateProps> = ({ getCategories, token }) => {
  const dispatch = useAppDispatch();
  const link = useAppSelector(linkStateSlice);
  const {
    reset,
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm<AddLinkFormType>({
    mode: 'onBlur',
    defaultValues: { type: 'Free', medium: 'Video', categories: [] }
  });
  const onSubmit: SubmitHandler<AddLinkFormType> = (formData) => {
    console.log('通過しました。');
    console.table(formData);
    const createLinkFormData = _.merge(formData, { token });
    console.log('createLinkFormData', createLinkFormData);
    dispatch(createLinkAsync(createLinkFormData));
    if (link.status === 'success') {
      console.log('初期化されました。');
      reset();
    }
  };
  console.log('errors', errors);
  return (
    <Header>
      {link.status === 'loading' && <DynamicLoading />}
      <PageTitle>submit Link/URL</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='md:grid md:grid-cols-4 md:gap-4'>
          <div>
            <div className='mb-5'>
              <h3 className='text-gray-500 mb-5'>Categories</h3>
              {errors.categories && (
                <ErrorMessage>{errors.categories.message}</ErrorMessage>
              )}
              <ul className='h-72 overflow-scroll'>
                {getCategories.length > 0
                  ? getCategories.map((category, index) => {
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
                            <label htmlFor={category.slug}>
                              {category.name}
                            </label>
                          </li>
                        </Fragment>
                      );
                    })
                  : null}
              </ul>
            </div>
            <div>
              <div className='mb-5'>
                <h3 className='text-gray-500 mb-3'>Type</h3>
                <InputRadio
                  register={register('type', {
                    required: 'Please select type'
                  })}
                  id='free'
                  type='type'
                  value='Free'>
                  Free
                </InputRadio>
                <InputRadio
                  register={register('type', {
                    required: 'Please select type'
                  })}
                  id='paid'
                  type='type'
                  value='Paid'>
                  Paid
                </InputRadio>
              </div>
              <div>
                <h3 className='text-gray-500 mb-3'>Medium</h3>
                <InputRadio
                  register={register('medium', {
                    required: 'Please select medium'
                  })}
                  id='video'
                  type='medium'
                  value='Video'>
                  Video
                </InputRadio>
                <InputRadio
                  register={register('medium', {
                    required: 'Please select medium'
                  })}
                  id='book'
                  type='medium'
                  value='Book'>
                  Book
                </InputRadio>
              </div>
            </div>
          </div>
          <div className='md:col-span-3'>
            <div className='mb-4'>
              <InputText
                id='title'
                inputType='text'
                placeholder='Link title'
                error={errors.title!}
                register={register('title', {
                  required: 'Please input link title'
                })}>
                Link title
              </InputText>
            </div>
            <div className='mb-4'>
              <InputText
                id='url'
                inputType='url'
                placeholder='Link url'
                error={errors.title!}
                register={register('url', {
                  required: 'Please input link title'
                })}>
                URL
              </InputText>
            </div>
            <button
              disabled={link.status === 'loading' ? true : false}
              type='submit'
              className='primary-btn'>
              Register
            </button>
          </div>
        </div>
      </form>
    </Header>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const token = getCokkie(null, ctx);
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
    const response = await axios.get(`${publicRuntimeConfig.API}/categories`);
    const categories = response.data.categories;
    return {
      props: {
        getCategories: categories,
        token
      }
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
};

// export const getStaticProps = async (ctx: NextPageContext) => {
//   const response = await axios.get(`${publicRuntimeConfig.API}/categories`);
//   const categories = response.data.allCategoryLists;

//   return {
//     props: {
//       categories
//     },
//     revalidate: 600
//     // notFoudを返す
//     // notFound: true
//     // redirect: {
//     //   destination: '/'
//     // }
//   };
// };

export default Create;
