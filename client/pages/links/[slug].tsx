import React, { FC, useState } from 'react';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { GetStaticProps, GetStaticPropsContext } from 'next';

// npm package
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';

// components
import { Header } from '../../components/layout/index';

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

type LinksRes = [
  {
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
];

interface LinksProps {
  category: CategoryRes;
  links: LinksRes;
  totalLinks: number;
  linksLimit: number;
  linkSkip: number;
}

const Links: FC<LinksProps> = ({
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip
}) => {
  const [allLinks, setAllLinks] = useState<LinksRes>(links);
  return (
    <Header>
      <div className='md:grid md:grid-cols-4 md:gap-4'>
        <div className='md:col-span-3'>
          <h1>{category.name}</h1>
          <div>
            {allLinks.map((link, index) => {
              return (
                <div key={index}>
                  <div>
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <h5>{link.title}</h5>
                      <h6>{link.url}</h6>
                    </a>
                  </div>
                  <div>
                    <span>
                      {moment(link.createdAt).fromNow()} by {link.postedBy.name}
                    </span>
                  </div>
                  <div>
                    <span>
                      {link.type} / {link.medium}
                    </span>
                    {link.categories.map((category, index) => {
                      return <span key={index}>{category.name}</span>;
                    })}
                  </div>
                </div>
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
  const limit = 1;
  const { slug } = ctx.params as SlugParams;
  const response = await axios.post(`${API}/category/${slug}`, { skip, limit });
  console.log('response', response.data.links);
  return {
    props: {
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