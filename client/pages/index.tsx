import React, { FC, Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { publicRuntimeConfig } from '../next.config';
import moment from 'moment';

// components
import { Header } from '../components/layout/index';
import { PageTitle } from '../components/atoms/index';

interface PopularLink {
  categories: {
    _id: string;
    name: string;
  }[];
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
  popularLinks: PopularLink[];
}

const Home: FC<HomeProps> = ({ categories, popularLinks }) => {
  const [allLinks, setAllLinks] = useState<PopularLink[]>(popularLinks);

  const incrementClick = async (linkId: string) => {
    const response = await axios.put(`${publicRuntimeConfig.API}/click-count`, {
      linkId
    });
    const tagetObjectIndex = allLinks.findIndex((link) => {
      console.log(
        'link._id = response.data.links._id',
        link._id === response.data.links._id
      );
      return link._id === response.data.links._id;
    });
    const cloneAllLinks = [...allLinks];
    cloneAllLinks[tagetObjectIndex].clicks = response.data.links.clicks;
    setAllLinks([...cloneAllLinks]);
  };
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
      <div>
        <h2>Trending {allLinks.length}</h2>
        {allLinks.map((link, index) => {
          return (
            <article key={index} className='bg-blue-200 p-5 rounded mb-5'>
              <div className='md:flex md:justify-between md:items-center mb-5'>
                <div className='md:w-8/12'>
                  <a
                    onClick={() => {
                      incrementClick(link._id);
                    }}
                    className='text-blue-600 hover:text-white hover:underline'
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <h5>{link.title}</h5>
                    <h6>{link.url}</h6>
                  </a>
                </div>
                <div className='md:w-3/12'>
                  <span className='block'>
                    {moment(link.createdAt).fromNow()} by {link.postedBy.name}
                  </span>
                  <span className='block'>{link.clicks} clicks</span>
                </div>
              </div>
              <div>
                <span className='md:mr-5'>
                  {link.type} / {link.medium}
                </span>
                {link.categories.map((category, index) => {
                  return (
                    <span key={index} className='mr-3'>
                      {category.name}
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </Header>
  );
};

export const getStaticProps = async () => {
  console.log('Re-generating...');
  try {
    const response = await axios.get(`${publicRuntimeConfig.API}/categories`);
    const popularLinksResponse = await axios.get(
      `${publicRuntimeConfig.API}/links/popular`
    );
    const categories = response.data.categories;
    const popularLinks = popularLinksResponse.data.links;
    console.log('popularLinks', popularLinks);

    return {
      props: {
        categories,
        popularLinks
      },
      revalidate: 600
      // notFoudを返す
      // notFound: true
      // redirect: {
      //   destination: '/'
      // }
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

export default Home;
