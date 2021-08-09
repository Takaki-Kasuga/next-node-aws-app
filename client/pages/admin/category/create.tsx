// https://www.youtube.com/watch?v=U-iz8b4RExA
// https://github.com/satansdeer/ultimate-react-hook-form-form/blob/master/src/components/FileInput.js

import React, { FC, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';
import Link from 'next/link';

// npm package
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import _ from 'lodash';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import striptags from 'striptags';

// helper function
import {
  adminServerSideProps,
  AdminServerSideProps
} from '../../../helpers/adminServerSideProps';

// components
import { PageTitle } from '../../../components/atoms/index';
import { Header } from '../../../components/layout/index';
import { Loading } from '../../../components/helpers/index';
import { InputText, Textarea } from '../../../components/forms/index';
import { ErrorMessage } from '../../../components/styles/index';

// slice
import {
  addCategoryAsync,
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
        resolve(uri);
      },
      'file'
    );
  });
};

interface CategoryFormType {
  name: string;
  content: string;
  image: any;
}

const Create: FC<AdminServerSideProps> = ({ user, token }) => {
  const dispatch = useAppDispatch();
  const category = useAppSelector(categoryStateSlice);

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
  } = useForm<CategoryFormType>({
    mode: 'onBlur',
    defaultValues: { name: '', content: '', image: '' }
  });

  const onSubmit: SubmitHandler<CategoryFormType> = async (formData) => {
    if (token) {
      const resizeImage = await resizeFile(formData.image[0]);

      const addCategoryFormData = _.extend(formData, {
        token,
        image: resizeImage
      });
      dispatch(addCategoryAsync(addCategoryFormData));
      if (category.status === 'success') {
        // reset();
      }
    }
  };

  return (
    <Header>
      {category.status === 'loading' ? <Loading /> : null}
      <PageTitle>Create Category</PageTitle>
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
          {/* <Textarea
            id='content'
            placeholder='Content description'
            error={errors.content!}
            register={register('content', {
              required: 'Please input content description',
              minLength: {
                value: 20,
                message: 'Content must be at least 20 characters long'
              }
            })}>
            Contents description
          </Textarea> */}
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
                return (
                  value[0].type.slice(0, 5) === 'image' ||
                  'You can upload only image files. ex:.gif,.png,.jpeg and so on.'
                );
              }
            })}>
            {watch('image') ? getValues('image')[0].name : 'Upload image'}
          </InputText>
        </div>
        <button
          type='submit'
          className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
          Create Category
        </button>
      </form>
    </Header>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  return adminServerSideProps(ctx);
};

export default Create;
