import { QueryKey, useMutation, useQuery } from 'react-query';
import { Task } from 'types/task';
import { useHttp } from './http';
import { SortProps } from './kanban';
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  useReorderTaskConfig,
} from './use-optimistic-options';

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(['tasks', param], () =>
    client(`tasks`, { data: param })
  );
};
export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  );
};
export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        data: params,
        method: 'PATCH',
      }),
    useEditConfig(queryKey)
  );
};
// 删除任务
export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    // 这里我没有出现问题，视频出现了问题
    // 直接（id:number)
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
};
export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(['task', { id }], () => client(`tasks/${id}`), {
    // 第二个参数是配置项,只有id有值时触发
    enabled: !!id,
  });
};
export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client('tasks/reorder', {
      data: params,
      method: 'POST',
    });
  }, useReorderTaskConfig(queryKey));
};
