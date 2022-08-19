import { useState, useEffect } from 'react';
import qs from 'qs';
import { List } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject, useDebounce, useMount } from '../../utils/index';

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });

  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const debounceParam = useDebounce(param, 2000);
  useEffect(() => {
    fetch(
      `${apiUrl}/projects?${qs.stringify(cleanObject(debounceParam))}`
    ).then(async (res) => {
      if (res.ok) {
        setList(await res.json());
      }
    });
  }, [debounceParam]);

  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (res) => {
      if (res.ok) {
        setUsers(await res.json());
      }
    });
  });

  return (
    <>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List users={users} list={list} />
    </>
  );
};
