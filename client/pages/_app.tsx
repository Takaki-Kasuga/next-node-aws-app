import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { store } from '../app/store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <link
          rel='stylesheet'
          href='https://use.fontawesome.com/releases/v5.1.0/css/all.css'
          integrity='sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt'
          crossOrigin='anonymous'></link>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
