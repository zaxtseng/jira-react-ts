import { useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { cleanObject } from './index';

/**
 * 返回页面url中,指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || '' };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, {} as { [key in K]: string }),
      [keys, searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      // searchParams是Iterator类型
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const;
};
