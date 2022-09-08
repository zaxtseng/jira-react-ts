import React from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import KanbanScreen from '../kanban/index';
import EpicScreen from '../epic/index';
import styled from '@emotion/styled';
import { Menu } from 'antd';

// 定义一个简单的hook 来判断当前的路由
const useRouteType = () => {
  // 得到的是一个路由数据数组，通过 / 来分隔
  const units = useLocation().pathname.split('/');
  // 得到最后的值，用来判断是看板还是数组
  return units[units.length - 1];
};

const ProjectScreen = () => {
  const routeType = useRouteType();

  return (
    <Container>
      <Aside>
        <Menu mode={'inline'} selectedKeys={[routeType]}>
          <Menu.Item key={'kanban'}>
            <Link to={'kanban'}>看板</Link>
          </Menu.Item>
          <Menu.Item key={'epic'}>
            <Link to={'epic'}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>

      <Routes>
        <Route path="/kanban" element={<KanbanScreen />} />
        <Route path="/epic" element={<EpicScreen />} />
        <Route
          path="/*"
          element={
            <Navigate
              to={window.location.pathname + '/kanban'}
              replace={true}
            />
          }
        />
      </Routes>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;
const Main = styled.div`
  box-shadow: -5px 0 -5px rgba(0, 0, 0, 0.1);
`;
// grid 布局，左边16rem，右边随意
const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
`;

export default ProjectScreen;
