import { List } from './list';
import { SearchPanel } from './search-panel';
import { useDebounce, useDocumentTitle } from '../../utils/index';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProject } from '../../utils/project';
import { useUsers } from '../../utils/users';
import { useUrlQueryParam } from 'utils/url';

export const ProjectListScreen = () => {
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  const debounceParam = useDebounce(param, 2000);
  const { isLoading, error, data: list } = useProject(debounceParam);
  const { data: users } = useUsers();

  useDocumentTitle('产品列表', false);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};
// 查询该组件为何无限循环
ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
