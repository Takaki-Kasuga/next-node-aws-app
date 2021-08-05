import cookie from 'js-cookie';
import nookies from 'nookies';
import {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext
} from 'next';
import Router from 'next/router';
import { LoginReturnData } from '../features/auth/authSlice';
interface callbackType {
  (): void;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// set in cookie
export const setCookie = (key: string, value: string) => {
  console.log('process.browser', process.browser);
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1
    });
  }
};

// remove from cookie
export const removeCokkie = (key: string) => {
  console.log('process.browser', process.browser);
  if (process.browser) {
    cookie.remove(key);
  }
};

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token

export const getCookieFromBrowser = (key: string) => {
  return cookie.get(key);
};
export const getCookieFromServer = (ctx: NextPageContext) => {
  if (nookies.get(ctx).token) {
    return nookies.get(ctx).token;
  } else {
    return false;
  }
};

export const getCokkie = (
  key: string | null,
  ctx?: NextPageContext | GetServerSidePropsContext | GetStaticPropsContext
) => {
  console.log('process.browser', process.browser);
  return process.browser
    ? getCookieFromBrowser(key!)
    : getCookieFromServer(ctx!);
};

// set in localstorage
export const setLocalStorage = (key: string, value: UserData) => {
  console.log('process.browser', process.browser);
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage
export const removeStorage = (key: string) => {
  console.log('process.browser', process.browser);
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

export const authenticate = (response: LoginReturnData, next: callbackType) => {
  setCookie('token', response.token);
  setLocalStorage('user', response.user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCokkie('token');
    console.log('cookieChecked', cookieChecked);
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user')!);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};

export const logout = () => {
  removeCokkie('token');
  removeStorage('user');
  Router.push('/login');
};
