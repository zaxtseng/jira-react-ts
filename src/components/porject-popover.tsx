import { Divider, List, Popover, Typography } from 'antd';
import React from 'react';
import { useProjects } from '../utils/project';
import styled from '@emotion/styled';
import { ButtonNoPadding } from './lib';
import { useProjectModal } from 'screens/project-list/utils';

const ProjectPopover = () => {
  const { projectModalOpen, open } = useProjectModal();

  const { data: projects, isLoading } = useProjects();
  //收藏的项目
  const pinnedProjects = projects?.filter((project) => project.pin);

  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding type={'link'} onClick={open}>
        创建项目
      </ButtonNoPadding>
    </ContentContainer>
  );

  return (
    <>
      <Popover placement="bottom" content={content}>
        <span>项目</span>
      </Popover>
    </>
  );
};

export default ProjectPopover;

const ContentContainer = styled.div`
  min-width: 30rem;
`;
