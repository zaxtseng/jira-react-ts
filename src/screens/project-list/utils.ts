import { useUrlQueryParam } from 'utils/url';
import { useMemo } from 'react';

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

/**
 * 此处hook扮演一个全局状态管理器的功能
 */
export const useProjectModal = () => {
  //读取url参数
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    'projectCreate',
  ]);

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setProjectCreate({ projectCreate: undefined });

  return {
    //因为url拿到的都是字符串
    projectModalOpen: projectCreate === 'true',
    open,
    close,
  };
};
