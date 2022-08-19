// import { useState, useEffect } from "react";

export interface User {
  name: string;
  id: string;
  email: string;
  title: string;
  organization: string;
}
export interface SearchPanelProps {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SearchPanelProps['param']) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <form>
      <input
        type={'text'}
        value={param.name}
        onChange={(e) => {
          setParam({ ...param, name: e.target.value });
        }}
      />
      <select
        value={param.personId}
        onChange={(e) => setParam({ ...param, personId: e.target.value })}
      >
        <option value="">负责人</option>
        {users.map((user) => (
          <option value={user.id} key={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </form>
  );
};
