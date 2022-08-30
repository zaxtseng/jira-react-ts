import { useState } from 'react';
import { useMountedRef } from 'utils';

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null,
};

export const useAsync = <D>(initialState?: State<D>) => {
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });
  // useState惰性初始化,保存函数会立即执行,如果非要保存,使用函数柯里化
  const [retry, setRetry] = useState(() => () => {});

  const mountedRef = useMountedRef();
  //设置data说明状态成功
  const setData = (data: D) =>
    setState({
      data,
      error: null,
      stat: 'success',
    });
  //设置data说明状态失败
  const setError = (error: Error) =>
    setState({
      error,
      data: null,
      stat: 'error',
    });
  // 接收异步
  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
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
    setState({ ...state, stat: 'loading' });
    // 最后返回promise
    return promise
      .then((data) => {
        // 判断当前是挂载还是卸载状态,挂载才赋值
        if (mountedRef.current) setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        // 注意catch会捕获error,不主动抛出就不能继续往下传递
        return Promise.reject(error);
      });
  };

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
