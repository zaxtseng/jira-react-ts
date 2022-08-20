import React, { FormEvent } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

type Props = {};

const LoginScreen = (props: Props) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (e.currentTarget.elements[1] as HTMLInputElement).value;
    // 登录
    const login = (param: { username: string; password: string }) => {
      fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(param),
      }).then((res) => {
        if (res.ok) {
        }
      });
    };

    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>用户名</label>
        <input type={'text'} id={'name'} />
      </div>

      <div>
        <label>密码</label>
        <input type={'password'} id={'password'} />
      </div>
      <div>
        <button type="submit">登录</button>
      </div>
    </form>
  );
};

export default LoginScreen;
