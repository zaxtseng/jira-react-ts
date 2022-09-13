import { QueryKey, useQueryClient } from 'react-query';
import { Task } from 'types/task';
import { reorder } from './reorder';

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    // 第二个参数即在成功获取数据后刷新数据
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    // 配置乐观更新
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return {
        previousItems,
      };
    },
    // 如果出错就将原数据回滚
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));
export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item: Task) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
