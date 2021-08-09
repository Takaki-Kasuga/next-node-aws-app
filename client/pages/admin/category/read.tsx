import React, { FC, useEffect } from 'react';
import { NextPageContext } from 'next';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Link from 'next/link';
import Image from 'next/image';

// helper function
import {
  adminServerSideProps,
  AdminServerSideProps
} from '../../../helpers/adminServerSideProps';

// components
import { Header } from '../../../components/layout/index';
import { PageTitle } from '../../../components/atoms/index';

// slice
import {
  getCategoriesAsync,
  categoryStateSlice,
  deleteCategoriesAsync
} from '../../../features/category/categorySlice';

const Read: FC<AdminServerSideProps> = ({ user, token }) => {
  const category = useAppSelector(categoryStateSlice);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // fetching latest categories
    dispatch(getCategoriesAsync());
  }, [dispatch]);

  const confirmDelete = (slug: string) => {
    if (window.confirm('Are you sure you want to delete')) {
      if (token) {
        dispatch(deleteCategoriesAsync({ slug, token }));
      }
    }
  };
  return (
    <Header>
      <PageTitle>List Categories</PageTitle>
      <p>list categories - {category.categories.length}</p>
      <div className='md:flex md:justify-items-center md:flex-wrap md:justify-evenly'>
        {category.categories.map((category) => {
          return (
            <div
              key={category._id}
              className='w-full md:w-1/4 mb-5 md:m-5 border-blue-500'>
              <Link href={`/links/${category.slug}`}>
                <a className='block pr-0 pl-0 pt-0'>
                  <figure className='block relative w-full md:h-60 h-80 transition duration-500 ease-in-out hover:transform hover:scale-125'>
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      layout='fill'
                      objectFit='contain'
                    />
                  </figure>
                  <h3 className='text-center p-1'>{category.name}</h3>
                </a>
              </Link>
              <div className='flex justify-evenly'>
                <div>
                  <Link href={`/admin/category/${category.slug}`}>
                    <a className='block text-green-700 font-semibold py-2 px-4 border border-green-500 hover:bg-green-500 hover:text-white hover:border-transparent rounded'>
                      Update
                    </a>
                  </Link>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      confirmDelete(category.slug);
                    }}
                    className='text-red-700 font-semibold py-2 px-4 border border-red-500 hover:bg-red-500 hover:text-white hover:border-transparent rounded'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Header>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  return adminServerSideProps(ctx);
};

export default Read;
