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
使用方法在prettier文档中.
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
## 提交时检测commit信息-commit-lint
```sh
// 安装
npm install --save-dev @commitlint/{config-conventional,cli}
// 配置
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

// 配置信息
cat <<EEE > .husky/commit-msg
#!/bin/sh
. "\$(dirname "\$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
EEE
```
## 出现无法提交的bug
```sh
// × lint-staged failed due to a git error.
// Any lost modifications can be restored from a git stash:

git commit -m "" --no-verify 绕过了lint的检查
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
const useArray = <T>(initialArray: T[]) => {
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
## 保证token的刷新
在context中的挂载阶段,获取token.
```tsx
// auth-provider.ts
const bootstrapUser = async () => {
  let user = null
  const token = auth.getToken()
  if(token) {
    const data = await http('me', {token})
    user = data.user
  }
  return user
}

//在provider中
useMount(() => {
  // bootstrapUser().then(user=>setUser(user))可以省略其中的user
  bootstrapUser().then(setUser)
})
```
# 第五章 Css-in-Js
## 安装craco
用于antd自定义主题变量,具体参考antd官网

## 使用styled-component和emotion
```sh
@emotion/styled @emotion/react
```
写法,注意首字母大写
```tsx
const Container = styled.div`
  display: flex;
`

// 注意styled后只能跟原生元素,如果要修改antd,加括号
const ShadowCard = styled(Card)`
  width: 40rem;
`
```
## 关于svg的引入问题
cra虽然声明了svg作为模块可以引入,但是仍会报错.   
解决方法:    
新建`src/react-app-env.d.ts`
```ts
/// <reference types="react-scripts" />
```
## Grid布局和Flex布局
区别:
1. 一维布局: flex;二维布局: grid;
2. 从内容出发用flex,布局出发用grid.
内容出发:先有一组数据,数量不固定,希望均匀分布在容器中,由内容自己的大小占据空间.
布局出发: 先规划网格,再把元素往里面填充. 

## 创建共用组件
```tsx
import styled from "@emotion/styled";

export const Row = styled.div<{
    gap?: number | boolean
    between?: boolean
    marginBottom?: number
}>`
    display: flex;
    align-items: center;
    justify-content: ${props =>props.between ? 'space-between' : undefined};
    margin-bottom: ${props => props.marginBottom + 'rem'};
    > *{
        margin-top: 0!important;
        margin-bottom: 0 !important;
        margin-right: ${props =>typeof props.gap === 'number' ? props.gap + 'rem' : props.gap ? '2rem' : undefined};
    }
`
```
# 修改网络请求工具
```sh
yarn add jira-dev-tool@next react-query
```
修改context文件
```tsx

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
  ```
  # 自定义Hook异步操作
  ```tsx
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
```
## 提取useAsync的部分内容结合页面创建新的Hook
```ts
// useProject
import { useEffect } from "react";
import { Project } from "screens/project-list/list";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

// 整个hook根据param变化生成数据,返回project
export const useProject = (param?: Partial<Project>) => {
    const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  useEffect(() => {
    run(client("projects", { data: cleanObject(param || {}) }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  // 将异步函数的生成结果返回
  return result
};
```
同理提取useUsers
# 添加登录页面Error信息
```ts
  const run = (promise: Promise<D>) => {
    // 如果不是promise类型报错
    if (!promise || !promise.then) {
      throw new Error('请传入Promise类型数据');
    }
    // 如果是,刚开始是loading状态
    setState({ ...state, stat: 'loading' });
    // 最后返回promise
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        // 注意catch会捕获error,不主动抛出就不能继续往下传递
        return Promise.reject(error);
      });
  };
  ```
  ## 完善注册密码验证
```tsx
  if (cpassword !== values.password) {
    onError(new Error("请确认两次密码相同"));
    return;
  }
  ```
  # 错误边界
  ```tsx
  import React from "react";

type FallBackRender = (props: { error: Error | null }) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallBackRender }>,
  { error: Error | null }
> {
  state = { error: null };
  // 当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
```
## useHook与闭包
```tsx
export const useDocumentTitle = (title: string, keepOnUnmount: boolean = true) => {
  // 挂载前
  const oldTitle = document.title;
  // 挂载时,传入的title赋给文档的title,而且oldTitle也改变了
  useEffect(() => {
    document.title = title
  },[])
  // 卸载时
  useEffect(() => {
    return () => {
      if(!keepOnUnmount) {
        // 因为这里面是一个闭包, 所以里面的oldTitle还是最初的title
        // 如果不指定依赖,这里的闭包就让title是旧title
        document.title = oldTitle
      }
    }
  }, [])
}
```
第二种方法实现,useRef,在挂载前使用ref保存oldTitle,useEffect中加入依赖.
# React-Router
```sh
yarn add react-router-dom
```

在要使用的页面构建Router的Context
```tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const AuthenticatedApp = () => {
  return (
    <Container>
      <PageHeader />
      <Main>
        {/* <ProjectListScreen /> */}
        <Router>
          <Routes>
            <Route path="/projects" element={<ProjectListScreen />} />
            <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
          </Routes>
        </Router>
      </Main>
    </Container>
  );
};
```
## 路由参数Hook

使用泛型约束传入的参数为指定的类型.
```ts
import { useSearchParams } from "react-router-dom"

/**
 * 返回页面url中,指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
    const [searchParams, setSearchParams] = useSearchParams()

    return [
        keys.reduce((prev, key) => {
            return {...prev, [key]: searchParams.get(key) || ''}
        },{} as {[key in K]: string}),
        setSearchParams
    ] as const
    // as const 将变量声明约束在const所规定的范围
}
```

## 查询无限渲染的问题
安装插件
```sh
yarn add --dev @welldone-software/why-did-you-render
```
原因: 因为使用useUrlQueryParams每次创建的param都不一样.导致effect的依赖每次都变化.

解决方法: 使用useMemo包裹.
```ts
/**
 * 返回页面url中,指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
    const [searchParams, setSearchParams] = useSearchParams()

    return [
        useMemo(() => keys.reduce((prev, key) => {
            return {...prev, [key]: searchParams.get(key) || ''}
        },{} as {[key in K]: string}), [searchParams]),
        // 另外这里不加keys会警告,但是因为keys不是state所以加了会无限循环,可以暂时注掉
        // 将setSearchParams替换成一个函数进行传入值的约束
        (params: Partial<{[key in K]: unknown}>) => {
            // searchParams是Iterator类型 ,可以使用Object.fromEntries转化为对象
            const o = cleanObject({...Object.fromEntries(searchParams), ...params}) as URLSearchParamsInit
            return setSearchParams(o)
        }
    ] as const
    // as const 将变量声明约束在const所规定的范围
}
```
# 抽象组件IdSelect
我们可以利用 `React` 自带的方法，获取到组件身上的全部类型

```ts
type SelectProps = React.ComponentProps<typeof Select>
```
然后，通过 `extends` 来继承 `SelectProps` 身上的方法
```ts
interface IdSelectProps extends SelectProps 
```
但是这样会有类型冲突的问题
![image-20210924105645394](https://ljcimg.oss-cn-beijing.aliyuncs.com/img/image-20210924105645394.png)
因此我们需要排除掉我们在这里使用过的类型，采用 `Omit` 方法
```tsx
interface IdSelectProps extends Omit<SelectProps, 'value' | "onChange" | "options" | "defaultOptionName">
```
这样我们定义的类型就能够接收所有的 `props` 了，最后还要解构一下其他的 `props` 噢

# 抽象user-Select组件


# 添加收藏功能
函数柯里化
```tsx
// 定义hook
export const useEditProject = () => {
  const { run,...asyncResult } = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    return run(client(`/projects/${params.id}`,{
      data: params,
      method: 'PATCH'
    }))
  }
  return {
    mutate,
    ...asyncResult
  }
}
// 普通使用
 const { mutate } = useEditProject()
  return (
    <Table
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project){
            return <Pin checked={true} onCheckedChange={(pin)=>mutate({id:project.id,pin})} />
          }
        },
// 函数科里化
const pinProject = (id:number) => (pin: boolean) => mutate({id,pin})
   <Table
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project){
            return <Pin checked={true} onCheckedChange={pinProject(project.id)} />
          }
        },
```

# retry
给useAsync添加retry,当被调用时,重新加载run.让state刷新一遍
```tsx
  // useState惰性初始化,保存函数会立即执行,如果非要保存,使用函数柯里化
  const [retry,setRetry] = useState(()=>()=>{})
  
    // 接收异步
  const run = (promise: Promise<D>, runConfig?:{retry: () => Promise<D>}) => {
    // 如果不是promise类型报错
    if (!promise || !promise.then) {
      throw new Error('请传入Promise类型数据');
    }
     // 定义重新刷新一次，返回一个有上一次 run 执行时的函数
    setRetry(()=>()=>{
      if(runConfig?.retry){
        run(runConfig?.retry(), runConfig)
      }
    })
  ```
# 乐观更新

# 阻止重复渲染
使用hook传出的函数不再重新定义,

用法:把将要在hook中使用的函数用useCallback包裹.

# 共享模态框
定义状态
```tsx
const [projectModalOpen, setProjectModalOpen] = useState(false);
```
创建组件
# component composition 
组件组合方式

将组件直接放到props中.
### 11. 怎么理解 component composition 这种透传数据的模式
引用官网的一句话
> Context 主要应用场景在于*很多*不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。
>
> **如果你只是想避免层层传递一些属性，[组件组合（component composition）](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)有时候是一个比 context 更好的解决方案。**
**我们把我们需要用到数据的那个组件直接丢到数据来源的 props 身上** ，然后消费数据，把消费完的组件，也就是要被渲染到页面的内容，通过 `props` 传回来。这就是 `component compositon` ，简单粗暴，我们在原来的地方，直接渲染这个组件即可
例如：我们在 `Page` 组件中需要传递个 `Auth` 组件 `user` 信息，它们之间有很多的深层嵌套
我们可以这么做 （官网例子）
```tsx
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}
// 现在，我们有这样的组件：
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...Page的子组件
<PageLayout userLink={...} />
// ... 渲染出 ...PageLayout的子组件
<NavigationBar userLink={...} />
// ... 渲染出 ...
{props.userLink}
```

这样我们只用传递 `userLink` 即可，

# 使用react-query
## 用url管理
```tsx
/**
 * 此处hook扮演一个全局状态管理器的功能
 */
export const useProjectModal = () => {
  //读取url参数
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    'projectCreate',
  ]);

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setProjectCreate({ projectCreate: undefined });

  return {
    //因为url拿到的都是字符串
    projectModalOpen: projectCreate === 'true',
    open,
    close,
  };
};
```
## 关于全局使用的状态操作
方法一: 可以使用redux设置一个state,设置对应的reducer,
一个同步设置状态,一个异步thunk.

方法二: 使用缓存,react-query.


## 将ErrorBox抽象出来成一个单独组件
```tsx
// 类型守卫(当符合条件时,value就是Error类型)
const isError = (value:any): value is Error =>value?.message

export const ErrorBox = ({error}: {error:unknown}) => {
  if(isError(error)) {
    return <Typography.Text type="danger">{error?.message}</Typography.Text>
  }

  return null
}
```
## 使用react-query改造获取数据改变状态
```tsx
// 整个hook根据param变化生成数据,返回project
export const useProject = (param?: Partial<Project>) => {
  const client = useHttp();
  // 此处param变化就会重新触发
  return useQuery<Project[]>(['projects', param],()=> client('projects',{data: param}))
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient()
  return useMutation((params: Partial<Project>) => client(`projects/${params.id}`, {
    data: params,
    method: 'PATCH',
  }),{
    // 第二个参数即在成功获取数据后刷新数据
    onSuccess: () => queryClient.invalidateQueries('projects')
  })
};
```

# 跨组件状态管理总结
## 小场面
状态提升 / 组合组件
## 缓存状态
react-query / swr
## 客户端状态
url / redux / context
# 看板页面开发
## 获取看板页面
新建utils/kanban.ts

# 拖拽排序
使用react-beautiful-dnd插件.
```tsx
export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <Droppable {...props}>
      {(provided => {
        if (React.isValidElement(children)) {
          //cloneElement用于将props传入绑定到children上
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided
          });
        }
        return <div />;
      })
    }
    </Droppable>
  );
};
```

## 拖拽数据持久化
要将数据存储下来.

# 搭建集成测试和单元测试
```bash
yarn add @testing-library/react-hooks msw -D
```

新建`__tests__`文件夹,约定`__`为测试使用文件夹.

## 单元测试
在`__tests__/http`中测试`http`模块.

下面模块用于模拟异步请求.
```ts
import { setupServer } from 'msw/node'
const server = setupServer()

// beforeAll是Jest测试库中一个方法,表示执行所有测试之前先执行
beforeAll(() => server.listen())
//每次测试完毕都重置mock路由
afterEach(() => server.resetHandlers())
//所有测试完毕后,关闭mock路由
afterAll(()=> server.close())

// 开始测试,第二个参数是回调函数就是测试内容
test('http异步发送请求', async () => { 
    const endpoint = "test-endpoint"
    const mockResult = { mockValue: 'mock'}

    // 使用msw模拟mock
    server.use(
        // rest是msw中用于restful接口的方法
        rest.get(`${apiUrl}/${endpoint}`,(req,res,ctx) =>{
            res(ctx.json(mockResult))
        })
    )
    // 使用http模块返回mock值
    const result = await http(endpoint)
    // 期望http的返回值和mock数据相等(注意不是完全相等,完全是toBe)
    expect(result).toEqual(mockResult)
 })

test('http请求时携带token', async () => { 
  const token = 'FAKE_TOKEN'
  const endpoint = "test-endpoint"
  const mockResult = { mockValue: 'mock'}

  let request:any

  // 使用msw模拟mock
  server.use(
      // rest是msw中用于restful接口的方法
      rest.get(`${apiUrl}/${endpoint}`,(req,res,ctx) =>{
          request = req
          return res(ctx.json(mockResult))
      })
  )
  // 使用http模块返回mock值
  await http(endpoint,{ token })
  // 期望http的返回值和mock数据相等(注意不是完全相等,完全是toBe)
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})
```
## 测试Hook
新建`__test__/use-async`文件.
```ts
import { act, renderHook } from "@testing-library/react";
import { useAsync } from "utils/use-async";

const defaultState: ReturnType<typeof useAsync> = {
  stat: "idle",
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
  stat: "loading",
  isLoading: true,
  isIdle: false,
};
const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "success",
  isSuccess: true,
  isIdle: false,
};

// 测试脚本
test("useAsync可以异步处理", async () => {
  let resolve: any, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const { result } = renderHook(() => useAsync());
  // 期望Hook的默认返回值与test的默认值一致
  expect(result.current).toEqual(defaultState)

  let p: Promise<any>;
  // 如果操作包含改变setState,需要使用act包裹
  act(() => {
    p = result.current.run(promise)
  })
  // 期望刚创建的promise中是loading状态
  expect(result.current).toEqual(loadingState)


  // 期望promise执行完毕后,返回的值是success状态的值
  const resolvedValue = { mockValue: 'resolved'}
  act(async () => {
    // 执行resolve,之后promise就是fulfilled
    resolve(resolvedValue)
    await p
  })
  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue
  })
});
```
## 测试组件
新建`__tests__/mark.tsx`用于测试高亮组件.
```tsx
import { renderHook } from "@testing-library/react-hooks";
import { screen } from "@testing-library/react";
import { Mark } from "../components/mark";

test("Mark组件正确高亮关键词", () => {
  const name = "物料管理";
  const keyword = "管理";

  renderHook(() => <Mark name={name} keyword={keyword} />);

  // 期望keyword存在document中
  expect(screen.getByText(keyword)).toBeInTheDocument();
  expect(screen.getByText(keyword)).toHaveStyle("color: #257AFD");
  // 期望其他字没有高亮颜色
  expect(screen.getByText("物料")).not.toHaveStyle("color: #257AFD");
});
```