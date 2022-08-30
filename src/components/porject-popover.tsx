import { Divider, List, Popover, Typography } from 'antd';
import React from 'react';
import { useProject } from '../utils/project';
import styled from '@emotion/styled';
import { ButtonNoPadding } from './lib';

type Props = {
  setProjectModalOpen: (isOpen: boolean) => void;
};

const ProjectPopover = (props: Props) => {
  const { data: projects, isLoading } = useProject();
  //收藏的项目
  const pinnedProjects = projects?.filter((project) => project.pin);

  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding
        type={'link'}
        onClick={() => props.setProjectModalOpen(true)}
      >
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