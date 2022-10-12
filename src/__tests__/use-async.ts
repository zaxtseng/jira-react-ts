import { act, renderHook } from '@testing-library/react';
import { useAsync } from 'utils/use-async';

const defaultState: ReturnType<typeof useAsync> = {
  stat: 'idle',
  error: null,
  data: null,
  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,
  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
};

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: 'loading',
  isLoading: true,
  isIdle: false,
};
const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: 'success',
  isSuccess: true,
  isIdle: false,
};

// 测试脚本
test('useAsync可以异步处理', async () => {
  let resolve: any, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const { result } = renderHook(() => useAsync());
  // 期望Hook的默认返回值与test的默认值一致
  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;
  // 如果操作包含改变setState,需要使用act包裹
  act(() => {
    p = result.current.run(promise);
  });
  // 期望刚创建的promise中是loading状态
  expect(result.current).toEqual(loadingState);

  // 期望promise执行完毕后,返回的值是success状态的值
  const resolvedValue = { mockValue: 'resolved' };
  act(async () => {
    // 执行resolve,之后promise就是fulfilled
    resolve(resolvedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  });
});
