import { useState, useCallback, useReducer, useRef } from 'react';
import { useMountedRef } from 'utils';

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}
// 初始状态
const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null,
};

// 默认配置方案
const defaultConfig = {
  throwOnError: false,
};

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  // 设置初始状态
  const config = { ...defaultConfig, initialConfig };
  // 使用reducer改造
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );
  // useState惰性初始化,保存函数会立即执行,如果非要保存,使用函数柯里化
  const [retry, setRetry] = useState(() => () => {});

  const safeDispatch = useSafeDispatch(dispatch);
  //设置data说明状态成功
  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        error: null,
        stat: 'success',
      }),
    [safeDispatch]
  );
  //设置data说明状态失败
  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        data: null,
        stat: 'error',
      }),
    [safeDispatch]
  );
  // 接收异步
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      // 如果不是promise类型报错
      if (!promise || !promise.then) {
        throw new Error('请传入Promise类型数据');
      }
      // 定义重新刷新一次，返回一个有上一次 run 执行时的函数
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      // 如果是,刚开始是loading状态
      safeDispatch({ stat: 'loading' });
      // 最后返回promise
      return promise
        .then((data) => {
          // 判断当前是挂载还是卸载状态,挂载才赋值
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          // 注意catch会捕获error,不主动抛出就不能继续往下传递
          if (config.throwOnError) return Promise.reject(error);
          return error;
        });
    },
    [config.throwOnError, safeDispatch, setData, setError]
  );

  // 将所有信息暴露
  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};
