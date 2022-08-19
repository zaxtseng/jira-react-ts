// 包含0的特殊情况
import { useEffect } from 'react';
import { useState } from 'react';
const isFalsy = (value) => (value === 0 ? false : !value)

// 清理不含值的对象
export const cleanObject = (obj) => {
    const result = { ...obj }
    Object.keys(result).forEach(key => {
        const value = result[key]
        if (isFalsy(value)) {
            delete result[key]
        }
    })
    return result
}

// 加载时的自定义Hook
export const useMount = callback => {
    useEffect(() => {
        callback()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState(value)
    useEffect(() => {
        // 每次value变化,设置一个定时器
        const timeout = setTimeout(() => setDebounceValue(value), delay)
        // 每次在上一个useEffect处理完在执行
        return () => {
            clearTimeout(timeout)
        }
    }, [delay, value])
    return debounceValue

}