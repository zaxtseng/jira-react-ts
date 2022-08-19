# 格式化配置安装
## 安装prettier
```sh
yarn add --dev --exact prettier
```
## 创建文件
```sh
echo {}> .prettierrc.json
# 在其中添加内容
# Ignore artifacts:
build
coverage
```
## 避免与eslint冲突
```sh
npm install --save-dev eslint-config-prettier
```
修改package.json文件
```json
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}
```
## 在git提交时格式化
```sh
yarn add --dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```
修改package.json文件
```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx,json,css,scss,md}": [
      "prettier --single-quote --write",
      "git add"
    ]
  }
}
```
# Mock数据

工具: `json-server`
安装: `yarn add json-server -D`

## 使用json-server
修改package.json
```json
  "scripts": {
    //**
    "json-server": "json-server __json_server_mock__/db.json --watch",
  }
```
## restful API
URI代表资源对象,METHOD代表行为
```
GET // 获取
POST // 新增
PUT //替换
PATCH //修改
DELETE //删除
```

# 第一章 工程列表
知识点: 状态提升

将获取list及状态的方法提升到父组件,这样子组件就都可以用props接收得到数据.
## 常用技巧
useState中设置setState中的方法可以将参数解构,简化浅拷贝
```jsx
onChange={e => setParam(...param, e.target.value)}
```

fetch方法返回的是异步可以用async处理
```jsx
fetch("").then(async (res) => {
    if (res.ok) {
    setList(await res.json());
    }
});
```

# 第二章 自定义Hook
```js
// 加载时的自定义Hook
export const useMount = callback => {
    useEffect(() => {
        callback()
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
```