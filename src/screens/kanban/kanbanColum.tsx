import styled from '@emotion/styled';
import { Button, Card, Dropdown, Menu, Modal } from 'antd';
import bugIcon from 'assets/bug.svg';
import taskIcon from 'assets/task.svg';
import { Mark } from 'components/mark';
import { Kanban } from 'types/kanban';
import { useTaskTypes } from 'utils/taskType';
import { useTasks } from '../../utils/task';
import { CreateTask } from './create-task';
import {
  useTasksSearchParams,
  useTaskModal,
  useKanbansQueryKey,
} from './utils';
import { Task } from 'types/task';
import { useDeleteKanban } from '../../utils/kanban';
import { Row } from 'components/lib';
import { forwardRef } from 'react';
import { Drag, Drop, DropChild } from 'components/drag-and-drop';

const TasksTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return (
    <img
      src={name === 'task' ? taskIcon : bugIcon}
      alt="task-icon"
      style={{ width: '2rem' }}
    />
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTaskModal();
  const { name: keyword } = useTasksSearchParams();

  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: '0.5rem' }}
      key={task.id}
    >
      <p>
        <Mark keyword={keyword} name={task.name} />
      </p>
      <TasksTypeIcon id={task.typeId} />
    </Card>
  );
};
export const KanbanColum = forwardRef<HTMLDivElement, { kanban: Kanban }>(
  ({ kanban, ...props }, ref) => {
    const { data: allTasks } = useTasks(useTasksSearchParams());
    const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

    return (
      <Container ref={ref} {...props}>
        <Row between={true}>
          <h3>{kanban.name}</h3>
          <More kanban={kanban} key={kanban.id} />
        </Row>
        <TasksContainer>
          <Drop
            type={'ROW'}
            direction={'vertical'}
            droppableId={String(kanban.id)}
          >
            <DropChild style={{ minHeight: '5px' }}>
              {tasks?.map((task, taskIndex) => (
                <Drag
                  key={task.id}
                  index={taskIndex}
                  draggableId={'task' + task.id}
                >
                  <div>
                    <TaskCard task={task} key={task.id} />
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
          <CreateTask kanbanId={kanban.id} />
        </TasksContainer>
      </Container>
    );
  }
);

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());

  const startEdit = () => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '你确定删除看板吗？',
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={'link'} onClick={startEdit}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay}>
      <Button type={'link'}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  /* min-height: 35rem; */
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;
const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
