import { Form, Input } from 'antd';
import { useAuth } from 'context/auth.context';
import { LongButton } from 'unauthenticated-app';
import { useAsync } from 'utils/use-async';

type Props = {
  onError: (error: Error) => void;
};

const RegisterScreen = ({ onError }: Props) => {
  const { register, user } = useAuth();
  const { run, isLoading } = useAsync();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await run(register(values));
    } catch (e: any) {
      onError(e);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={'username'}
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" type={'text'} id={'name'} />
      </Form.Item>

      <Form.Item
        name={'password'}
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input placeholder="密码" type={'password'} id={'password'} />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} type="primary" htmlType="submit">
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};

export default RegisterScreen;
