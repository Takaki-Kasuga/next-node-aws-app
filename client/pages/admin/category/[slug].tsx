// https://www.youtube.com/watch?v=U-iz8b4RExA
// https://github.com/satansdeer/ultimate-react-hook-form-form/blob/master/src/components/FileInput.js

import React, { FC, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ParsedUrlQuery } from 'querystring';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';

// npm package
import axios from 'axios';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import _ from 'lodash';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import striptags from 'striptags';

// helper function
import { isAxiosError } from '../../../helpers/axiosError';
import { publicRuntimeConfig } from '../../../next.config';
import { getCokkie } from '../../../helpers/storageToken';

// components
import { PageTitle } from '../../../components/atoms/index';
import { Header } from '../../../components/layout/index';
import { Loading } from '../../../components/helpers/index';
import { InputText } from '../../../components/forms/index';
import { ErrorMessage } from '../../../components/styles/index';

// slice
import {
  updateCategoryAsync,
  categoryStateSlice,
  defaultStatus
} from '../../../features/category/categorySlice';

import 'react-quill/dist/quill.snow.css';

const resizeFile = (image: any) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      720,
      540,
      'JPEG',
      100,
      0,
      (uri) => {
        console.log('uri', uri);
        resolve(uri);
      },
      'file'
    );
  });
};

// interface WillUpdateProps {

//  }

interface UpdateCategoryFormType {
  name: string;
  content: string;
  image: any;
}

const Update: FC<any> = ({ slug, oldCategory, token }) => {
  const dispatch = useAppDispatch();
  const category = useAppSelector(categoryStateSlice);
  console.log('token', token);

  useEffect(() => {
    return () => {
      dispatch(defaultStatus());
    };
  }, [dispatch]);
  const {
    reset,
    control,
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm<UpdateCategoryFormType>({
    mode: 'onBlur',
    defaultValues: {
      name: oldCategory.name,
      content: oldCategory.content
    }
  });

  const onSubmit: SubmitHandler<UpdateCategoryFormType> = async (formData) => {
    if (token) {
      console.log('通過しました。');
      console.log(formData);

      const resizeImage = await resizeFile(formData.image[0]);

      const updateCategoryFormData = _.extend(formData, {
        slug,
        token,
        image: resizeImage
      });
      console.log('updateCategoryFormData', updateCategoryFormData);
      dispatch(updateCategoryAsync(updateCategoryFormData));
      if (category.status === 'success') {
        reset();
      }
    }
  };

  return (
    <Header>
      {category.status === 'loading' ? <Loading /> : null}
      <PageTitle>Update Category</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <div className='mb-4'>
          <InputText
            id='name'
            inputType='text'
            placeholder='Category Name'
            error={errors.name!}
            register={register('name', {
              required: 'Please input category name'
            })}>
            Category Name
          </InputText>
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='content'>
            Contents description
          </label>
          <Controller
            name='content'
            control={control}
            rules={{
              required: 'Please input content description',
              validate: (value) => {
                const stringNum = striptags(value);
                console.log('stringNum', stringNum);
                console.log('stringNumlength', stringNum.length);
                return (
                  stringNum.length > 20 ||
                  'Content must be at least 20 characters long'
                );
              }
            }}
            render={({ field }) => (
              <ReactQuill
                placeholder='Content description'
                theme='snow'
                {...field}
              />
            )}
          />
          {errors.content! && (
            <ErrorMessage>{errors.content!.message}</ErrorMessage>
          )}
        </div>
        <div className='mb-4'>
          <InputText
            hidden={true}
            id='image'
            accept='image/*'
            inputType='file'
            placeholder='Upload image file'
            error={errors.image!}
            register={register('image', {
              required: 'Please upload image file',
              validate: (value) => {
                console.log('value', value[0].type.slice(0, 5));
                return (
                  value[0].type.slice(0, 5) === 'image' ||
                  'You can upload only image files. ex:.gif,.png,.jpeg and so on.'
                );
              }
            })}>
            {watch('image') && getValues('image')[0]
              ? getValues('image')[0].name
              : 'Upload image'}
          </InputText>
        </div>
        <button type='submit' className='primary-btn'>
           Update Category
        </button>
      </form>
    </Header>
  );
};

interface SlugParams extends ParsedUrlQuery {
  slug: string;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = getCokkie(null, ctx);
  const { slug } = ctx.params as SlugParams;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  try {
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const response = await axios.get(
      `${publicRuntimeConfig.API}/admin`,
      config
    );
    // control auth and routing
    if (response.data.user.role !== 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const theCategory = await axios.post(
      `${publicRuntimeConfig.API}/category/${slug}`,
      config
    );

    return {
      props: {
        slug,
        oldCategory: theCategory.data.category,
        token
      }
    };
  } catch (error) {
    console.log('エラーが起きています。');
    if (isAxiosError(error)) {
      console.log('error.response', error.response);
      if (error.response!.status === 401) {
        return {
          props: {
            user: 'No admin',
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

export default Update;
