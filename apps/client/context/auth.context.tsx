import axios from '../async/axios';
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { useRouter } from 'next/router';
import { StripeSeller, UserRole } from '../types';

interface IAuthContext {
  user: {
    _id: string;
    email: string;
    name: string;
    picture?: string;
    role: UserRole[];
    createdAt: Date;
    // SELLER STUFF
    stripe_account_id?: string;
    stripe_seller?: StripeSeller;
  };
}

// initial state
const intialState: IAuthContext = {
  user: null,
};

type AuthAction =
  | { type: 'LOGIN'; payload: IAuthContext['user'] }
  | { type: 'LOGOUT' };

// create context
export const AuthContext = createContext<{
  state: IAuthContext;
  dispatch: Dispatch<AuthAction>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ state: intialState, dispatch: () => {} });
export const useAuth = () => {
  return useContext(AuthContext);
};

type AuthState = IAuthContext;

// root reducer
const rootReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      window?.localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'LOGOUT':
      window?.localStorage.removeItem('user');
      return { ...state, user: null };
    default:
      return state;
  }
};

// context provider
const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(rootReducer, intialState);

  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      const res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((_, reject) => {
          axios
            .get('/auth/logout')
            .then(() => {
              // console.log('/401 error > logout');
              dispatch({ type: 'LOGOUT' });
              router.push('/login');
            })
            .catch((err) => {
              console.warn('AXIOS INTERCEPTORS ERR', err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const user = window?.localStorage.getItem('user');
    if (user) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    const getCSRF = async () => {
      const { data } = await axios.get('/csrf-token');
      // console.log('CSRF', data);
      axios.defaults.headers['X-CSRF-TOKEN'] = data.csrfToken;
    };
    getCSRF();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
