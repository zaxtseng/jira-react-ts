import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { http } from 'utils/http';

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer();

// beforeAll是Jest测试库中一个方法,表示执行所有测试之前先执行
beforeAll(() => server.listen());

//每次测试完毕都重置mock路由
afterEach(() => server.resetHandlers());

//所有测试完毕后,关闭mock路由
afterAll(() => server.close());

// 开始测试,第二个参数是回调函数就是测试内容
test('http异步发送请求', async () => {
  const endpoint = 'test-endpoint';
  const mockResult = { mockValue: 'mock' };

  // 使用msw模拟mock
  server.use(
    // rest是msw中用于restful接口的方法
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.json(mockResult));
    })
  );
  // 使用http模块返回mock值
  const result = await http(endpoint);
  // 期望http的返回值和mock数据相等(注意不是完全相等,完全是toBe)
  expect(result).toEqual(mockResult);
});

// 开始测试,第二个参数是回调函数就是测试内容
test('http请求时携带token', async () => {
  const token = 'FAKE_TOKEN';
  const endpoint = 'test-endpoint';
  const mockResult = { mockValue: 'mock' };

  let request: any;

  // 使用msw模拟mock
  server.use(
    // rest是msw中用于restful接口的方法
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );
  // 使用http模块返回mock值
  await http(endpoint, { token });
  // 期望http的返回值和mock数据相等(注意不是完全相等,完全是toBe)
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
});
