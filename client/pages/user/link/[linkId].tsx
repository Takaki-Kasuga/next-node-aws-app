// https://www.youtube.com/watch?v=U-iz8b4RExA
// https://github.com/satansdeer/ultimate-react-hook-form-form/blob/master/src/components/FileInput.js

import React, { FC, Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

// slice
import { updatePrivateLinkAsync } from '../../../features/link/privateLinkSlice';

// npm package
import axios from 'axios';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import _ from 'lodash';

// helper function
import { publicRuntimeConfig } from '../../../next.config';
import { getCokkie } from '../../../helpers/storageToken';

// components
import { PageTitle } from '../../../components/atoms/index';
import { Header } from '../../../components/layout/index';
const DynamicLoading = dynamic(
  () => import('../../../components/helpers/Loading')
);
import { InputText, InputRadio } from '../../../components/forms/index';
import { ErrorMessage } from '../../../components/styles/index';

interface Link {
  categories: { _id: string; name: string; slug: string }[];
  type: string;
  medium: string;
  clicks: number;
  _id: string;
  title: string;
  url: string;
  slug: string;
  postedBy: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type Categories = {
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

interface ServerProps {
  categories: Categories;
  link: Link;
  token: string;
}

interface UpdateLinkFormType {
  title: string;
  url: string;
  categories: string[];
  type: string;
  medium: string;
}

const Update: FC<ServerProps> = ({ token, link, categories }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    reset,
    control,
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm<UpdateLinkFormType>({
    mode: 'onBlur',
    defaultValues: {
      title: link.title,
      url: link.url,
      categories: link.categories.map((category) => category._id),
      type: link.type,
      medium: link.medium
    }
  });

  const onSubmit: SubmitHandler<UpdateLinkFormType> = (formData) => {
    if (typeof formData.categories === 'string') {
      formData.categories = [formData.categories] as unknown as string[];
    }
    const createLinkFormData = _.merge(formData, {
      token,
      privateLinkId: link._id
    });
    dispatch(updatePrivateLinkAsync(createLinkFormData));
    //  if (link.status === 'success') {
    //    console.log('初期化されました。');
    //    reset();
    //  }
  };

  return (
    <Header>
      {/* {link.status === 'loading' && <DynamicLoading />} */}
      <PageTitle>submit Link/URL</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='md:grid md:grid-cols-4 md:gap-4'>
          <div>
            <div className='mb-5'>
              <h3 className='text-gray-500 mb-5'>Categories</h3>
              {/* {errors.categories && (
                <ErrorMessage>{errors.categories.message}</ErrorMessage>
              )} */}
              <ul className='max-h-72 overflow-scroll'>
                {categories.length > 0
                  ? categories.map((category, index) => {
                      return (
                        <Fragment key={index}>
                          <li className='mb-3 '>
                            <input
                              defaultChecked={link.categories.some(
                                (item) => item._id === category._id
                              )}
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
              // disabled={link.status === 'loading' ? true : false}
              type='submit'
              className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
              Register
            </button>
          </div>
        </div>
      </form>
    </Header>
  );
};

interface SlugParams extends ParsedUrlQuery {
  linkId: string;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = getCokkie(null, ctx);
  const { linkId } = ctx.params as SlugParams;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  if (!token || !linkId) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  try {
    const getLink = await axios.get(
      `${publicRuntimeConfig.API}/link/${linkId}`,
      config
    );

    const getCategories = await axios.get(
      `${publicRuntimeConfig.API}/categories`,
      config
    );

    if (!getLink || !getCategories) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }
    return {
      props: {
        link: getLink.data.link,
        categories: getCategories.data.categories,
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

export default Update;
