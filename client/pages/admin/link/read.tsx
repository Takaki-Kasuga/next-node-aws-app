import React, { FC, useState } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';

// npm package
import axios from 'axios';
import moment from 'moment';
const InfiniteScroll = dynamic(() => import('react-infinite-scroller'), {
  ssr: false
});

// components
import { Header } from '../../../components/layout/index';
const DynamicLoadingSpinner = dynamic(
  () => import('../../../components/helpers/LoadingSpinner')
);
import { PageTitle } from '../../../components/atoms/index';

// API
import { API } from '../../../config/config';

// helper finction
import { getCokkie } from '../../../helpers/storageToken';
import { isAxiosError } from '../../../helpers/axiosError';

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
  token: string;
  links: LinksRes;
  totalLinks: number;
  linksLimit: number;
  linkSkip: number;
}

const Links: FC<LinksProps> = ({
  token,
  links,
  totalLinks,
  linksLimit,
  linkSkip
}) => {
  const [allLinks, setAllLinks] = useState<LinksRes>(links);
  const [limit, setLimit] = useState<number>(linksLimit);
  const [skip, setSkip] = useState<number>(linkSkip);
  const [size, setSize] = useState<number>(totalLinks);

  const loadMore = async () => {
    if (size >= limit) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      const toSkip = skip + limit;
      const response = await axios.post(
        `${API}/links`,
        {
          skip: toSkip,
          limit
        },
        config
      );
      console.log('size', size);
      console.log('limit', limit);
      console.log('これから非同期通信で持ってきます');
      console.log('response.data.links', response.data.links);
      setAllLinks([...allLinks, ...response.data.links]);
      setSize(response.data.links.length);
      setSkip(toSkip);
    }
  };
  return (
    <Header>
      <PageTitle>All Links</PageTitle>
      <div>
        {allLinks.map((link, index) => {
          return (
            <article key={index} className='bg-blue-200 p-5 rounded mb-5'>
              <div className='md:flex md:justify-between md:items-center mb-5'>
                <div className='md:w-8/12'>
                  <a
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  console.log('Regenerating...(getStaticProps) in admin/link/read');
  const token = getCokkie(null, ctx);
  console.log('token', token);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  try {
    const responseAdmin = await axios.get(`${API}/admin`, config);
    console.log('responseAdmin.data', responseAdmin.data);
    // control auth and routing
    if (responseAdmin.data.user.role !== 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const skip = 0;
    const limit = 5;
    const response = await axios.post(
      `${API}/links`,
      {
        skip,
        limit
      },
      config
    );
    console.log('response', response.data.links);
    return {
      props: {
        token,
        links: response.data.links,
        totalLinks: response.data.links.length,
        linksLimit: limit,
        linkSkip: skip
      }
    };
  } catch (error) {
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
    } else {
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
};

export default Links;
