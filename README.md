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

修改值时可以先将该值拷贝,修改拷贝值,return出来
```tsx
const useArray = <T></T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray)

  return {
    value,
    setValue,
    add: (item: V) => {
      setValue([...item, value])
    },
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value]
      copy.splice(index,1)
      setValue(copy)
    }
  }
}
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
# 第三章 登录注册
## 对json-server中间件辅助
新建`__json_server_mock__/middleware.js`
```js
module.exports = (req, res, next) => {
    if(req.method === 'POST' && req.path === '/login') {
        if(req.body.username === 'tom' && req.body.password === '123456') {
            return res.status(200).json({
                user: {
                    token: '123'
                }
            })
        }else {
            return res.status(400).json({message: '密码错误'})
        }
    }
}
```
修改package.json文件
```json
"json-server": "json-server __json_server_mock__/db.json --watch --port 3001 --middlewares __json_server_mock__/middleware.js",
```
## 安装jira-dev-tool
用于服务代理,将请求数据缓存在localStorage中.可以对网络设置对应控制.
```sh
npx imooc-jira-tool
```
注意: 该依赖中引用antd由于和rca中有冲突,所以将node_modules中该依赖引用的所有antd.css都改成antd.min.css即可.
# 第四章 使用useContext
## 创建context
使用createContext方法创建context
```tsx
// 泛型可以约束传入的内容
const AuthContext = createContext<{ user: User | null; login: (form: AuthForm) => Promise<void>; register: (form: AuthForm) => Promise<void>; logout: () => void; } | undefined>(undefined)
// context 的名字
AuthContext.displayName = 'AuthContext'
```
## 创建Provider及其附属方法
```tsx
export const AuthProvider = ({children}: {children:ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)

    const login = (form: AuthForm) => auth.login(form).then(setUser)
    const register = (form: AuthForm) => auth.register(form).then(setUser)
    const logout = () => auth.logout()
    return <AuthContext.Provider children={children} value={{ user, login, register, logout }} />
}
```
## 使Context在全局生效
包裹App组件
```tsx
root.render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  )
```
## 调用context
使用useHook自定义hook调用context
```tsx
const useAuth = () => {
  const context = useContext(AuthContext)
   if(!context) {
        throw new Error("useAuth必须在AuthProvider中使用")
    }
    return context
}
```
## 页面中使用
```tsx
const { login,user } = useAuth()
```
# 构建请求工具http
使用fetch封装,注意和axios的区别,无法捕获非网络异常导致的error.必须手动Promise.reject()抛出.
