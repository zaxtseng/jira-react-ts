import styled from '@emotion/styled';
import { Spin } from 'antd';
import { Drag, Drop, DropChild } from 'components/drag-and-drop';
import { ScreenContainer } from 'components/lib';
import { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useDocumentTitle } from 'utils';
import { useKanbans, useReorderKanban } from '../../utils/kanban';
import { useReorderTask, useTasks } from '../../utils/task';
import { CreateKanban } from './create-kanban';
import { KanbanColum } from './kanbanColum';
import { SearchPanel } from './search-panel';
import { TaskModal } from './task-modal';
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTasksQueryKey,
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
  const onDragEnd = useDragEnd();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <ColumnContainer>
            <Drop
              type={'COLUMN'}
              direction={'horizontal'}
              droppableId={'kanban'}
            >
              <DropChild style={{ display: 'flex' }}>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={'kanban' + kanban.id}
                    index={index}
                  >
                    <KanbanColum kanban={kanban} key={kanban.id} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};
export default KanbanScreen;

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());

  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) {
        return;
      }
      if (type === 'COLUMN') {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[source.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        const type = destination.index > source.index ? 'after' : 'before';
        reorderKanban({ fromId, referenceId: toId, type });
      }
      if (type === 'ROW') {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;
        // 不允许跨版排序
        if (fromKanbanId !== toKanbanId) {
          return;
        }
        const fromTask = allTasks.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTasks.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) {
          return;
        }
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? 'after'
              : 'before',
        });
      }
    },
    [allTasks, kanbans, reorderKanban, reorderTask]
  );
};
export const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: scroll;
  margin-right: 2rem;
`;
