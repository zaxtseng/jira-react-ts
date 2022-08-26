import { Form, Input } from 'antd';
import Password from 'antd/lib/input/Password';
import { useAuth } from 'context/auth.context';
import { LongButton } from 'unauthenticated-app';
import { useAsync } from 'utils/use-async';

type Props = {
  onError: (error: Error) => void;
};
interface regSubmitProps {
  username: string;
  password: string;
  cpassword: string;
}

const RegisterScreen = ({ onError }: Props) => {
  const { register } = useAuth();
  const { run, isLoading } = useAsync();

  const handleSubmit = async ({ cpassword, ...values }: regSubmitProps) => {
    if (cpassword !== values.password) {
      onError(new Error('请确认两次密码相同'));
      return;
    }
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
      <Form.Item
        name={'cpassword'}
        rules={[{ required: true, message: '请确认密码' }]}
      >
        <Input placeholder={'确认密码'} type="password" id={'cpassword'} />
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
