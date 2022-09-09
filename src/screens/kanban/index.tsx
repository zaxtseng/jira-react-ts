import styled from '@emotion/styled';
import { Spin } from 'antd';
import { Drag, Drop } from 'components/drag-and-drop';
import { ScreenContainer } from 'components/lib';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDocumentTitle } from 'utils';
import { useKanbans } from '../../utils/kanban';
import { useTasks } from '../../utils/task';
import { CreateKanban } from './create-kanban';
import { KanbanColum } from './kanbanColum';
import { SearchPanel } from './search-panel';
import { TaskModal } from './task-modal';
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from './utils';

const KanbanScreen = () => {
  useDocumentTitle('看板列表');

  // 获取看板
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = kanbanIsLoading || taskIsLoading;
  const { data: currentProject } = useProjectInUrl();
  return (
    <DragDropContext onDragEnd={() => {}}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <Drop type={'COLUMN'} direction={'horizontal'} droppableId={'kanban'}>
            <ColumnContainer>
              {kanbans?.map((kanban, index) => (
                <Drag
                  key={kanban.id}
                  draggableId={'kanban' + kanban.id}
                  index={index}
                >
                  <KanbanColum kanban={kanban} key={kanban.id} />
                </Drag>
              ))}
              <CreateKanban />
            </ColumnContainer>
          </Drop>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};
export default KanbanScreen;
export const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: scroll;
  margin-right: 2rem;
`;
