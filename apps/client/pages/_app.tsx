import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css';
import TopNav from '../components/TopNav';
import AuthProvider from '../context/auth.context';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TopNav />
      <Component {...pageProps} />
      <ToastContainer position="top-center" />
    </AuthProvider>
  );
}

export default CustomApp;
