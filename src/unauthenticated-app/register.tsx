import { useAuth } from 'context/auth.context';
import { FormEvent } from 'react';

type Props = {};

const RegisterScreen = (props: Props) => {
  const { register, user } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (e.currentTarget.elements[1] as HTMLInputElement).value;
    // const register = (param: { username: string; password: string }) => { }
    register({ username, password });
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
        <button type="submit">注册</button>
      </div>
    </form>
  );
};

export default RegisterScreen;
