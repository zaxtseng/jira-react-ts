// 包含0的特殊情况
const isFalsy = (value) => (value === 0 ? false : !value)

// 清理不含值的对象
export const cleanObject = (obj) => {
    const result = {...obj}
    Object.keys(result).forEach(key => {
        const value = result[key]
        if(isFalsy(value)){
            delete result[key]
        }
    })
    return result
}