import { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProject } from 'utils/project';
import { useTask } from 'utils/task';
import { useUrlQueryParam } from 'utils/url';
import { useDebounce } from '../../utils/index';

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbansQueryKey = () => ['kanbans', useKanbanSearchParams()];

export const useTasksSearchParams = () => {
  const [param] = useUrlQueryParam(['name', 'typeId', 'processorId', 'tagId']);

  const projectId = useProjectIdInUrl();
  // 有bug
  // const debouncedName = useDebounce(param.name, 2000);
  return useMemo(
    () => ({
      projectId,
      name: param.name,
      typeId: Number(param.typeId) || undefined,
      tagId: Number(param.tagId) || undefined,
      processorId: Number(param.processorId) || undefined,
    }),
    [projectId, param]
  );
};

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()];

export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    'editingTaskId',
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );
  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: '' });
  }, [setEditingTaskId]);
  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};
