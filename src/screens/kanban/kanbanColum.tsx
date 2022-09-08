import styled from '@emotion/styled';
import { Card } from 'antd';
import bugIcon from 'assets/bug.svg';
import taskIcon from 'assets/task.svg';
import { Kanban } from 'types/kanban';
import { useTaskTypes } from 'utils/taskType';
import { useTasks } from '../../utils/task';
import { useTasksSearchParams } from './utils';

const TasksTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  console.log(taskTypes, 'taskTypes');

  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === 'task' ? taskIcon : bugIcon} alt="" />;
};

export const KanbanColum = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

  return (
    <Container>
      <h3>{kanban.name}</h3>
      <TasksContainer>
        {tasks?.map((tasks) => (
          <Card style={{ marginBottom: '0.5rem' }} key={tasks.id}>
            <div>{tasks.name}</div>
            <TasksTypeIcon id={tasks.typeId} />
          </Card>
        ))}
      </TasksContainer>
    </Container>
  );
};

const Container = styled.div`
  min-width: 27rem;
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
