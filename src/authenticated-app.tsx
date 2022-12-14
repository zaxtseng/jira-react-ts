import styled from '@emotion/styled';
import { Button, Dropdown, Menu } from 'antd';
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg';
import ProjectPopover from 'components/porject-popover';
import { useAuth } from 'context/auth.context';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import ProjectScreen from 'screens/project';
import { resetRoute } from 'utils';
import { ButtonNoPadding, Row } from './components/lib';
import { ProjectListScreen } from './screens/project-list/index';
import ProjectModal from './screens/project-list/project-modal';
import UserPopover from './components/user-popover';

const AuthenticatedApp = () => {
  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          {/* <ProjectListScreen /> */}

          <Routes>
            <Route path="/" element={<Navigate to={'/projects'} />} />
            <Route path="/projects" element={<ProjectListScreen />} />
            <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
          </Routes>
        </Main>

        <ProjectModal />
      </Router>
    </Container>
  );
};

export default AuthenticatedApp;

//采用grid布局
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

// Header内部分为左右
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;

const Main = styled.main`
  display: flex;
  overflow: hidden;
  /* height: calc(100vh - 6rem); */
`;

const PageHeader = () => {
  const { logout, user } = useAuth();
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={'link'} onClick={resetRoute}>
          <SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'} />
        </ButtonNoPadding>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={'logout'}>
                <Button type="link" onClick={logout}>
                  登出
                </Button>
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="link" onClick={(e) => e.preventDefault()}>
            Hi,{user?.name}
          </Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};
