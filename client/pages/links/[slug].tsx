import React, { FC, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { GetStaticProps, GetStaticPropsContext } from 'next';

// npm package
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
const InfiniteScroll = dynamic(() => import('react-infinite-scroller'), {
  ssr: false
});

// components
import { Header } from '../../components/layout/index';
const DynamicLoadingSpinner = dynamic(
  () => import('../../components/helpers/LoadingSpinner')
);

// API
import { API } from '../../config/config';

// types
interface CategoryRes {
  image: {
    url: string;
    key: string;
  };
  _id: string;
  name: string;
  content: string;
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

type LinksRes = {
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
}[];

interface LinksProps {
  slug: string;
  category: CategoryRes;
  links: LinksRes;
  totalLinks: number;
  linksLimit: number;
  linkSkip: number;
}

const Links: FC<LinksProps> = ({
  slug,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip
}) => {
  const [allLinks, setAllLinks] = useState<LinksRes>(links);
  const [limit, setLimit] = useState<number>(linksLimit);
  const [skip, setSkip] = useState<number>(linkSkip);
  const [size, setSize] = useState<number>(totalLinks);

  const incrementClick = async (linkId: string) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    const tagetObjectIndex = allLinks.findIndex((link) => {
      console.log(
        'link._id = response.data.links._id',
        link._id === response.data.links._id
      );
      return link._id === response.data.links._id;
    });
    const cloneAllLinks = [...allLinks];
    cloneAllLinks.splice(tagetObjectIndex, 1, response.data.links);
    setAllLinks([...cloneAllLinks]);
  };

  const loadMore = async () => {
    const toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${slug}`, {
      skip: toSkip,
      limit
    });
    setAllLinks([...allLinks, ...response.data.links]);
    console.log('allLinks', allLinks);
    console.log('response.data.links.length', response.data.links.length);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };
  return (
    <Header>
      <div className='flex flex-col-reverse md:grid md:grid-cols-4 md:gap-4'>
        <div className='md:col-span-3'>
          <h1 className='md:text-3xl mb-3'>{category.name} - URL/Links</h1>
          <div className='p-5 bg-gray-200 mb-5'>
            {ReactHtmlParser(category.content)}
          </div>
          <div>
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
                        {moment(link.createdAt).fromNow()} by{' '}
                        {link.postedBy.name}
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
        </div>
        <div>
          <figure className='block relative w-full md:h-40 h-80'>
            <Image
              src={category.image.url}
              alt={category.name}
              layout='fill'
              objectFit='cover'
            />
          </figure>
          <div>
            <h2>Most popular in {category.name}</h2>
            <p>Show popular links</p>
          </div>
        </div>
      </div>

      {size > 0 && size >= limit && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit ? true : false}
          loader={
            <div className='text-center' key={0}>
              <DynamicLoadingSpinner />
            </div>
          }></InfiniteScroll>
      )}
    </Header>
  );
};

interface SlugParams extends ParsedUrlQuery {
  slug: string;
}
export const getStaticProps: GetStaticProps = async (
  ctx: GetStaticPropsContext
) => {
  console.log('Regenerating...(getStaticProps)');
  const skip = 0;
  const limit = 2;
  const { slug } = ctx.params as SlugParams;
  const response = await axios.post(`${API}/category/${slug}`, { skip, limit });
  console.log('response', response.data.links);
  return {
    props: {
      slug,
      category: response.data.category,
      links: response.data.links,
      totalLinks: response.data.links.length,
      linksLimit: limit,
      linkSkip: skip
    }
  };
};
export const getStaticPaths = async () => {
  console.log('Regenerating...(getStaticPath)');
  const response = await axios.get(`${API}/categories`);
  const pathsWithParams = response.data.allCategoryLists.map((list: any) => {
    return { params: { slug: list.slug } };
  });
  console.log('pathsWithParams', pathsWithParams);
  return {
    paths: pathsWithParams,
    fallback: false
  };
};

export default Links;
