import { useSetUrlSearchParam, useUrlQueryParam } from 'utils/url';
import { useMemo } from 'react';
import { useProject } from 'utils/project';
import { useSearchParams } from 'react-router-dom';

export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [params] = useProjectsSearchParams();
  return ['projects', params];
};
/**
 * 此处hook扮演一个全局状态管理器的功能
 */
export const useProjectModal = () => {
  // 判断当前是不是在创建,在这个方法中，相当于重写了封装了修改url的方法，通过传入的值来设置查询字符串的key
  // 通过 set... 来控制 url 的值
  //读取url参数
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    'projectCreate',
  ]);
  // 当处在编辑状态就有id
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    'editingProjectId',
  ]);

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const setUrlParams = useSetUrlSearchParam();
  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setUrlParams({ editingProjectId: '', projectCreate: '' });

  // const close = () => {
  //   editingProjectId
  //     ? setEditingProjectId({ editingProjectId: undefined })
  //     : setProjectCreate({ projectCreate: undefined });
  // };

  //开始编辑
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });
  return {
    //因为url拿到的都是字符串
    projectModalOpen: projectCreate === 'true' || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
