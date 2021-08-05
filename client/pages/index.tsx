import React, { FC, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { publicRuntimeConfig } from '../next.config';

// components
import { Header } from '../components/layout/index';
import { PageTitle } from '../components/atoms/index';

import { getCokkie } from '../helpers/storageToken';

interface HomeProps {
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

const Home: FC<HomeProps> = ({ categories }) => {
  return (
    <Header>
      <PageTitle>Browse Tutorial/Course</PageTitle>
      <div className='md:flex md:flex-wrap text-center'>
        {categories.map((category, index) => {
          return (
            <Link href={`/links/${category.slug}`} key={index}>
              <a className='primary-btn block md:w-4/12 m-5 md:m-0 md:mb-5'>
                <div>
                  <Image
                    src={category.image.url}
                    width={340}
                    height={160}
                    alt={category.name}
                    objectFit='contain'
                  />
                </div>
                <div>
                  <h3>{category.name}</h3>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </Header>
  );
};

export const getStaticProps = async () => {
  console.log('Re-generating...');
  const response = await axios.get(`${publicRuntimeConfig.API}/categories`);
  const categories = response.data.categories;

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

export default Home;
