import { QueryKey, useMutation, useQuery } from 'react-query';
import { Kanban } from 'types/kanban';
import { useHttp } from './http';
import {
  useAddConfig,
  useDeleteConfig,
  useReorderKanbanConfig,
} from './use-optimistic-options';

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(['kanbans', param], () =>
    client(`kanbans`, { data: param })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        data: params,
        method: 'POST',
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: 'DELETE',
      }),
    useDeleteConfig(queryKey)
  );
};

export interface SortProps {
  fromId: number; //要重新排序的item
  referenceId: number; //目标item
  type: 'before' | 'after'; //放在目标item的前面还是后面
  fromKanbanId?: number;
  toKanbanId?: number;
}
export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client('kanbans/reorder', {
      data: params,
      method: 'POST',
    });
  }, useReorderKanbanConfig(queryKey));
};
