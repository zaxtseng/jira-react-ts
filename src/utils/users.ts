import { useEffect } from 'react';
import { cleanObject } from 'utils';
import { User } from '../types/user';
import { useHttp } from './http';
import { useAsync } from './use-async';

// 整个hook根据param变化生成数据,返回project
export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();
  useEffect(() => {
    run(client('users', { data: cleanObject(param || {}) }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  // 将异步函数的生成结果返回
  return result;
};
