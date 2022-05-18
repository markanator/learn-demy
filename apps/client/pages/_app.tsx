import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css';
import TopNav from '../components/TopNav';
import AuthProvider from '../context/auth.context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const client = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      <AuthProvider>
        <TopNav />
        <Component {...pageProps} />
        <ToastContainer position="top-center" hideProgressBar closeOnClick />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default CustomApp;
