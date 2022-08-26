import { useState, useEffect } from 'react';
import qs from 'qs';
import { List, Project } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject, useDebounce, useMount } from '../../utils/index';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';
import { useAsync } from '../../utils/use-async';
import { Typography } from 'antd';

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });

  const [users, setUsers] = useState([]);
  // const [list, setList] = useState([]);
  const debounceParam = useDebounce(param, 2000);

  const client = useHttp();
  const { run, isLoading, error, data: list } = useAsync<Project[]>();

  useEffect(() => {
    client('projects', { data: cleanObject(debounceParam) });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceParam]);

  useMount(() => {
    client('users').then(setUsers);
  });

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel param={param} setParam={setParam} users={users} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users} dataSource={list || []} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
