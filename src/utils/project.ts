import { useQuery, useQueryClient, useMutation, QueryKey } from 'react-query';
import { Project } from 'screens/project-list/list';
import { useHttp } from './http';
import {
  useEditConfig,
  useAddConfig,
  useDeleteConfig,
} from './use-optimistic-options';

// 整个hook根据param变化生成数据,返回project
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  // 此处param变化就会重新触发
  return useQuery<Project[]>(['projects', param], () =>
    client('projects', { data: param })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: 'PATCH',
      }),
    useEditConfig(queryKey)
  );
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  );
};
export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ['project', { id }],
    () => client(`projects/${id}`),
    {
      // 第二个参数是配置项,只有id有值时触发
      enabled: !!id,
    }
  );
};
