import { Form, Input } from 'antd';
import { UserSelect } from 'components/user-select';
import { Project } from 'types/project';
import { User } from 'types/user';

export interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, 'name' | 'personId'>>;
  setParam: (param: SearchPanelProps['param']) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form layout="inline" style={{ marginBottom: '2rem' }}>
      <Form.Item>
        <Input
          type={'text'}
          placeholder="项目名"
          value={param.name}
          onChange={(e) => {
            setParam({ ...param, name: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
        ></UserSelect>
      </Form.Item>
      {/* <Select
        value={param.personId}
        onChange={(value) => setParam({ ...param, personId: value })}
      >
        <Select.Option value="">负责人</Select.Option>
        {users.map((user) => (
          <Select.Option value={String(user.id)} key={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select> */}
    </Form>
  );
};
