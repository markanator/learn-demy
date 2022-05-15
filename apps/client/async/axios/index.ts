import axios from 'axios';
import { useAuth } from '../../context/auth.context';
import { useRouter } from 'next/router';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const { dispatch } = useAuth();
    const router = useRouter();
    const res = err.response;
    // check if status code is 401
    if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
      return new Promise((res, rej) => {
        instance
          .get('/auth/logout')
          .then((data) => {
            console.log('401 ERROR > LOGOUT', data);
            dispatch({ type: 'LOGOUT' });
            router.push('/login');
            res(data);
          })
          .catch((err) => {
            console.warn('AXIOS INTERCEPTER ERROR', err);
            rej(err);
          });
      });
    }

    return Promise.reject(err);
  }
);

export default instance;
