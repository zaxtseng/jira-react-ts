// import './App.css';
import { Button } from 'antd';
import LoginScreen from 'screens/login';
import { ProjectListScreen } from './screens/project-list';

function App() {
  return (
    <div>
      <LoginScreen />
      <ProjectListScreen />
      <Button>que</Button>
    </div>
  );
}

export default App;
