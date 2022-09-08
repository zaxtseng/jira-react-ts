import styled from '@emotion/styled';
import { Spin } from 'antd';
import { ScreenContainer } from 'components/lib';
import { useDocumentTitle } from 'utils';
import { useKanbans } from '../../utils/kanban';
import { useTasks } from '../../utils/task';
import { CreateKanban } from './create-kanban';
import { KanbanColum } from './kanbanColum';
import { SearchPanel } from './search-panel';
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
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      {isLoading ? (
        <Spin size={'large'} />
      ) : (
        <ColumnContainer>
          {kanbans?.map((kanban) => (
            <KanbanColum kanban={kanban} key={kanban.id} />
          ))}
          <CreateKanban />
        </ColumnContainer>
      )}
    </ScreenContainer>
  );
};
export default KanbanScreen;
export const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: scroll;
  margin-right: 2rem;
`;
