import styled from '@emotion/styled';
import { Button } from 'antd';
import { ErrorBox, Row } from 'components/lib';
import { useProjectModal } from 'screens/project-list/utils';
import { useDebounce, useDocumentTitle } from '../../utils/index';
import { useProjects } from '../../utils/project';
import { useUsers } from '../../utils/users';
import { List } from './list';
import { SearchPanel } from './search-panel';
import { useProjectsSearchParams } from './utils';

export const ProjectListScreen = () => {
  const { open } = useProjectModal();
  const [param, setParam] = useProjectsSearchParams();
  // const debounceParam = useDebounce(projectParams, 2000);
  const {
    isLoading,
    error,
    data: list,
  } = useProjects(useDebounce(param, 2000));
  const { data: users } = useUsers();

  useDocumentTitle('产品列表', false);

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={open}>创建项目</Button>
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      <ErrorBox error={error} />
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};
// 查询该组件为何无限循环
ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
