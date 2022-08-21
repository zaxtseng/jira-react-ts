import React, { useState } from 'react';
import LoginScreen from 'screens/login';
import RegisterScreen from './register';

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  return (
    <div>
      {isRegister ? <LoginScreen /> : <RegisterScreen />}
      <button onClick={() => setIsRegister(!isRegister)}>
        切换到{isRegister ? '登录' : '注册'}
      </button>
    </div>
  );
};
