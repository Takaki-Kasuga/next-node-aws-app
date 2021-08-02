import React, { FC, Fragment } from 'react';
import { NextPageContext } from 'next';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

// components
import { Header } from '../../../components/layout/index';
import { PageTitle } from '../../../components/atoms/index';
import { InputText } from '../../../components/forms/index';
import { ErrorMessage } from '../../../components/styles/index';

// helper function
import {
  userServerSideProps,
  UserServerSideProps
} from '../../../helpers/userServerSideProps';

import { publicRuntimeConfig } from '../../../next.config';

interface CreateProps {
  categories: {
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
  }[];
}

interface AddLinkFormType {
  title: string;
  url: string;
  categories: string[];
  type: string;
  medium: string;
}

const Create: FC<CreateProps> = ({ categories }) => {
  const {
    reset,
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm<AddLinkFormType>({
    mode: 'onBlur'
  });

  const onSubmit: SubmitHandler<AddLinkFormType> = (formData) => {
    console.log('通過しました。');
    console.table(formData);
    // reset();
  };

  return (
    <Header>
      <PageTitle>submit Link/URL</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='md:grid md:grid-cols-4 md:gap-4'>
          <div>
            <h3 className='text-gray-500 mb-5'>Categories</h3>
            {errors.categories && (
              <ErrorMessage>{errors.categories.message}</ErrorMessage>
            )}
            <ul className='md:h-72 md:overflow-scroll'>
              {categories.map((category, index) => {
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
              })}
            </ul>
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
            <button type='submit' className='primary-btn'>
              Register
            </button>
          </div>
        </div>
      </form>
    </Header>
  );
};

export const getStaticProps = async (ctx: NextPageContext) => {
  const response = await axios.get(`${publicRuntimeConfig.API}/categories`);
  const categories = response.data.allCategoryLists;

  return {
    props: {
      categories
    },
    revalidate: 600
    // notFoudを返す
    // notFound: true
    // redirect: {
    //   destination: '/'
    // }
  };
};

export default Create;
