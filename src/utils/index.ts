// 包含0的特殊情况
import { useEffect, useRef } from 'react';
import { useState } from 'react';
// const isFalsy = (value: unknown) => (value === 0 ? false : !value);
const isVoid = (value: unknown) =>
  value === undefined || value === null || value === '';
// 清理不含值的对象
export const cleanObject = (obj: { [key: string]: unknown }) => {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

// 加载时的自定义Hook
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// 后面用泛型来解决
export const useDebounce = <V>(value: V, delay?: number): any => {
  // 设置一个 debouncedValue 值，用于暂存值，以及监控变化
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 接收一个定时器，参数为一个函数和延时时间
    // 每次value变化，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次上一个useEffect 的定时器被清除，相当于上一个定时器被卸载了
    return () => clearTimeout(timeout);
    // 监听value 和 delay 变化，当参数变化时，重新调用这个函数设置定时器
  }, [value, delay]);
  // 返回值
  return debouncedValue;
};

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  // 挂载前
  // const oldTitle = document.title;
  // 使用useRef保存title
  const oldTitle = useRef(document.title).current;
  // 挂载时
  useEffect(() => {
    document.title = title;
  }, [title]);
  // 卸载时
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // 如果不指定依赖,这里的闭包就让title是旧title
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

// 重定向路由方法
export const resetRoute = () => (window.location.href = window.location.origin);

// 返回组件的挂载状态,为挂载或已卸载返回false,反之,true
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return mountedRef;
};
