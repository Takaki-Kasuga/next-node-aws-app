import React, { FC } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { GetStaticProps, GetStaticPropsContext } from 'next';

// npm package
import axios from 'axios';

// components
import { Header } from '../../components/layout/index';

// API
import { API } from '../../config/config';

const Links: FC<any> = ({
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip
}) => {
  return (
    <Header>
      <div className='md:grid md:grid-cols-4 md:gap-4'>
        <div className='md:col-span-3'>{JSON.stringify(links)}</div>
        <div>Right Side Bar</div>
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
