import { useState } from "react";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State = {
  stat: "idle",
  data: null,
  error: null,
};

export const useAsync = <D>(initialState?: State<D>) => {
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    initialState,
  });

  //设置data说明状态成功
  const setData = (data: D) =>
    setState({
      data,
      error: null,
      stat: "success",
    });
//设置data说明状态失败
  const setError = (error: Error) =>
    setState({
      error,
      data: null,
      stat: "error",
    });
// 接收异步
  const run = (promise: Promise<D>) => {
    // 如果不是promise类型报错
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }
    // 如果是,刚开始是loading状态
    setState({ ...state, stat: "loading" });
    // 最后返回promise
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        return error;
      });
  };
  // 将所有信息暴露
  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    ...state
  };
};
