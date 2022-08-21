import './App.less';
import { useAuth } from 'context/auth.context';
import AuthenticatedApp from 'authenticated-app';
import { UnauthenticatedApp } from 'unauthenticated-app';

function App() {
  const { user } = useAuth();
  return <div>{user ? <AuthenticatedApp /> : <UnauthenticatedApp />}</div>;
}

export default App;
