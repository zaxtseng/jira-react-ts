import Input from 'antd/lib/input/Input';
import { useState } from 'react';
import { useAddKanban } from 'utils/kanban';
import { Container } from './kanbanColum';
import { useKanbansQueryKey, useProjectIdInUrl } from './utils';

export const CreateKanban = () => {
  const [name, setName] = useState('');
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addKanban } = useAddKanban(useKanbansQueryKey());

  const submit = async () => {
    await addKanban({ name, projectId });
    setName('');
  };

  return (
    <Container>
      <Input
        size="large"
        placeholder="新建看板名称"
        onPressEnter={submit}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Container>
  );
};
