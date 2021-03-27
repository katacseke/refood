import { Toaster } from 'react-hot-toast';
import '../styles/globals.scss';
import { AuthProvider } from '../context/authContext';

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
