import { Button, List, Modal } from 'antd';
import { Row, ScreenContainer } from 'components/lib';
import dayjs from 'dayjs';
import { useProjectInUrl } from 'screens/kanban/utils';
import { useEpics } from 'utils/epic';
import { useEpicSearchParams, useEpicsQueryKey } from './util';
import { useTasks } from '../../utils/task';
import { Link } from 'react-router-dom';
import { useDeleteEpic } from '../../utils/epic';
import { CreateEpic } from './create-epic';
import { useState } from 'react';
import { Epic } from 'types/epic';

const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);
  // 删除时的提示框
  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      title: `你确定删除项目组${epic.name}吗？`,
      content: '点击确定删除',
      okText: '确定',
      onOk() {
        // 确认时调用删除
        deleteEpic({ id: epic.id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name}任务组</h1>
        <Button onClick={() => setEpicCreateOpen(true)} type="link">
          创建任务组
        </Button>
      </Row>
      <List
        dataSource={epics}
        itemLayout={'vertical'}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button type={'link'} onClick={() => confirmDeleteEpic(epic)}>
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间:{dayjs(epic.start).format('YYYY-MM-DD')}</div>
                  <div>结束时间:{dayjs(epic.end).format('YYYY-MM-DD')}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    to={`projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                    key={task.id}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic
        onClose={() => setEpicCreateOpen(false)}
        visible={epicCreateOpen}
      />
    </ScreenContainer>
  );
};

export default EpicScreen;
