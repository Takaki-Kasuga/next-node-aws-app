import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { GetServerSideProps } from 'next';
import { NextPageContext } from 'next';
import Link from 'next/link';

// npm package
import { useForm, SubmitHandler } from 'react-hook-form';
import _ from 'lodash';

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

// slice
import {
  addCategoryAsync,
  categoryStateSlice
} from '../../../features/category/categorySlice';

interface CategoryFormType {
  name: string;
  content: string;
  image: any;
}

const Create: FC<AdminServerSideProps> = ({ user, token }) => {
  const dispatch = useAppDispatch();
  const category = useAppSelector(categoryStateSlice);
  console.log('user', user);
  console.log('token', token);
  const {
    reset,
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm<CategoryFormType>({
    mode: 'onBlur',
    defaultValues: { name: '', content: '', image: '' }
  });

  const onSubmit: SubmitHandler<CategoryFormType> = (formData) => {
    if (token) {
      console.log('通過しました。');
      console.log(formData);
      const addCategoryFormData = _.extend(formData, {
        token,
        image: formData.image[0]
      });
      console.log('addCategoryFormData', addCategoryFormData);
      dispatch(addCategoryAsync(addCategoryFormData));
      // reset();
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
          <Textarea
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
          </Textarea>
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
            {watch('image') ? getValues('image')[0].name : 'Upload image'}
          </InputText>
        </div>
        <button type='submit' className='primary-btn'>
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
