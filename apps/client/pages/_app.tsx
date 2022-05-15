import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.css';
import TopNav from '../components/TopNav';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TopNav />
      <Component {...pageProps} />
    </>
  );
}

export default CustomApp;
