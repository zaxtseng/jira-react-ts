import * as auth from 'auth-provider';
import { FullPageLoading } from 'components/lib';
import { createContext, ReactNode, useContext } from 'react';
import { useQueryClient } from 'react-query';
import { User } from 'types/user';
import { useMount } from 'utils';
import { http } from 'utils/http';
import { useAsync } from 'utils/use-async';
import { FullPageErrorFallback } from '../components/lib';

const AuthContext = createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

AuthContext.displayName = 'AuthContext';

interface AuthForm {
  username: string;
  password: string;
}

// 启动时重置token
const bootstrapUser = async () => {
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
  const queryClient = useQueryClient();

  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      // 清除useQuery获取的数据
      queryClient.clear();
    });

  // 挂载时重置user
  useMount(() => {
    run(bootstrapUser());
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用');
  }
  return context;
};
