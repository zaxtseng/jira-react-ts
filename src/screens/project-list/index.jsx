import { useState, useEffect } from "react";
import qs from "qs";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { cleanObject } from "../../utils/index";

const apiUrl = process.env.REACT_APP_API_URL;
export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });

  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(param))}`).then(
      async (res) => {
        if (res.ok) {
          setList(await res.json());
        }
      }
    );
  }, [param]);

  useEffect(() => {
    fetch(`${apiUrl}/users`).then(async (res) => {
      if (res.ok) {
        setUsers(await res.json());
      }
    });
  }, [param]);

  return (
    <>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List users={users} list={list} />
    </>
  );
};
