import axios from '../async/axios';
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

interface IAuthContext {
  user: {
    _id: string;
    email: string;
    name: string;
    picture?: string;
    role: string[];
    createdAt: Date;
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
  const [state, dispatch] = useReducer(rootReducer, intialState);

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
      console.log('CSRF', data);
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
