import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { store } from '../app/store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
