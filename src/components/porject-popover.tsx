import styled from '@emotion/styled';
import { Divider, List, Popover, Typography } from 'antd';
import { useProjectModal } from 'screens/project-list/utils';
import { useProjects } from '../utils/project';
import { ButtonNoPadding } from './lib';

const ProjectPopover = () => {
  const { open } = useProjectModal();

  const { data: projects, refetch } = useProjects();
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
      <Popover
        onVisibleChange={() => refetch()}
        placement="bottom"
        content={content}
      >
        <span>项目</span>
      </Popover>
    </>
  );
};

export default ProjectPopover;

const ContentContainer = styled.div`
  min-width: 30rem;
`;
