import React from 'react';
import { useDocumentTitle } from 'utils';
import { useKanbans } from '../../utils/kanban';
import { useKanbanSearchParams, useProjectInUrl } from './utils';
import { KanbanColum } from './kanbanColum';
import styled from '@emotion/styled';

const KanbanScreen = () => {
  useDocumentTitle('看板列表');

  // 获取看板
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { data: currentProject } = useProjectInUrl();
  return (
    <div>
      <h1>{currentProject?.name}看板</h1>
      <ColumnContainer>
        {kanbans?.map((kanban) => (
          <KanbanColum kanban={kanban} key={kanban.id} />
        ))}
      </ColumnContainer>
    </div>
  );
};
export default KanbanScreen;
const ColumnContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;
