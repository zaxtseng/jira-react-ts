import { useState, useEffect } from 'react';
import qs from 'qs';
import { List, Project } from './list';
import { SearchPanel } from './search-panel';
import {
  cleanObject,
  useDebounce,
  useDocumentTitle,
  useMount,
} from '../../utils/index';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';
import { useAsync } from '../../utils/use-async';
import { Typography } from 'antd';
import { useProject } from '../../utils/project';
import { useUsers } from '../../utils/users';

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });

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

const Container = styled.div`
  padding: 3.2rem;
`;
