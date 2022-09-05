import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import * as auth from 'auth-provider';
import { User } from 'screens/project-list/search-panel';
import { http } from 'utils/http';
import { useMount } from 'utils';
import { useAsync } from 'utils/use-async';
import { FullPageLoading } from 'components/lib';
import { FullPageErrorFallback } from '../components/lib';
import { useDispatch, useSelector } from 'react-redux';
import * as authStore from 'store/auth.slice';
import { selectUser } from 'store/auth.slice';

// const AuthContext = createContext<
//   | {
//       user: User | null;
//       login: (form: AuthForm) => Promise<void>;
//       register: (form: AuthForm) => Promise<void>;
//       logout: () => Promise<void>;
//     }
//   | undefined
// >(undefined);

// AuthContext.displayName = "AuthContext";

export interface AuthForm {
  username: string;
  password: string;
}

// 启动时重置token
export const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http('me', { token });
    user = data.user;
  }
  return user;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);

  const {
    run,
    isIdle,
    isLoading,
    isError,
    error,
    data: user,
    setData: setUser,
  } = useAsync<User | null>();
  // 采用 redux
  const dispatch: (...args: any[]) => Promise<User> = useDispatch();
  // 挂载时重置user
  useMount(() => {
    run(dispatch(authStore.bootstrap()));
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return <div>{children}</div>;
};

export const useAuth = () => {
  // const context = useContext(AuthContext);
  const user = useSelector(selectUser);
  const dispatch: (...args: any[]) => Promise<User> = useDispatch();
  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);

  return {
    user,
    login,
    register,
    logout,
  };
  // if (!context) {
  //   throw new Error('useAuth必须在AuthProvider中使用');
  // }
};
