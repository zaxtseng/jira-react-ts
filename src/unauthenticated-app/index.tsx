import styled from '@emotion/styled';
import { Card, Button, Divider } from 'antd';
import React, { useState } from 'react';
import LoginScreen from 'screens/login';
import RegisterScreen from './register';
// import logo from 'assets/logo.svg';

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  return (
    <Container>
      <ShadowCard>
        {isRegister ? <RegisterScreen /> : <LoginScreen />}
        <Divider />
        <Button type="link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '已经有账号了? 直接登录' : '没有账号? 先注册'}
        </Button>
      </ShadowCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const ShadowCard = styled(Card)`
  width: 40rem;
  /* min-height: 56rem; */
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`;

// const Header = styled.header`
//   background: url(${logo})
// `
