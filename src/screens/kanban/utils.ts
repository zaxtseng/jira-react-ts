import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProject } from 'utils/project';
import { useUrlQueryParam } from 'utils/url';

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbansQueryKey = () => ['kanbans', useKanbanSearchParams()];

export const useTasksSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    'name',
    'typeId',
    'processorId',
    'tagId',
  ]);

  const projectId = useProjectIdInUrl();
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
