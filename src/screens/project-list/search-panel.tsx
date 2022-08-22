// import { useState, useEffect } from "react";

import { Input, Select } from 'antd';

export interface User {
  name: string;
  id: string;
  email: string;
  title: string;
  organization: string;
  token: string;
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
      <Input
        type={'text'}
        value={param.name}
        onChange={(e) => {
          setParam({ ...param, name: e.target.value });
        }}
      />
      <Select
        value={param.personId}
        onChange={(value) => setParam({ ...param, personId: value })}
      >
        <Select.Option value="">负责人</Select.Option>
        {users.map((user) => (
          <Select.Option value={user.id} key={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
    </form>
  );
};
