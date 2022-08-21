import React from 'react';
import LoginScreen from 'screens/login';
import { useAuth } from 'context/auth.context';

const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <>
      <button onClick={logout}>登出</button>
      <LoginScreen />
    </>
  );
};

export default AuthenticatedApp;
