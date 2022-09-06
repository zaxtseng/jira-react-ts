import { useEffect, useCallback } from 'react';
import {
  useQuery,
  QueryClient,
  useQueryClient,
  useMutation,
} from 'react-query';
import { Project } from 'screens/project-list/list';
import { cleanObject } from 'utils';
import { useHttp } from './http';
import { useAsync } from './use-async';

// 整个hook根据param变化生成数据,返回project
export const useProject = (param?: Partial<Project>) => {
  const client = useHttp();
  // 此处param变化就会重新触发
  return useQuery<Project[]>(['projects', param], () =>
    client('projects', { data: param })
  );
};

export const useEditProject = () => {
  // const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: 'PATCH',
      }),
    {
      // 第二个参数即在成功获取数据后刷新数据
      onSuccess: () => queryClient.invalidateQueries('projects'),
    }
  );
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: 'POST',
      }),
    {
      // 第二个参数即在成功获取数据后刷新数据
      onSuccess: () => queryClient.invalidateQueries('projects'),
    }
  );
};
