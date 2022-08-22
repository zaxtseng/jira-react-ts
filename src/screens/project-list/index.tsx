import { useState, useEffect } from 'react';
import qs from 'qs';
import { List } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject, useDebounce, useMount } from '../../utils/index';
import { useHttp } from 'utils/http';

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });

  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const debounceParam = useDebounce(param, 2000);

  const client = useHttp();

  useEffect(() => {
    client('projects', { data: cleanObject(debounceParam) }).then(setList);
  }, [debounceParam]);

  useMount(() => {
    client('users').then(setUsers);
  });

  return (
    <>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List users={users} list={list} />
    </>
  );
};
