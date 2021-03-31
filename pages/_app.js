import { Router } from 'next/router';
import { Toaster } from 'react-hot-toast';
import NProgress from 'nprogress';
import '../styles/globals.scss';
import '../styles/nprogress.scss';
import { AuthProvider } from '../context/authContext';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
