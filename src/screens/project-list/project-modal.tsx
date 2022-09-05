import { Button, Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  projectListActions,
  selectProjectModalOpen,
} from 'screens/project-list/project-list.slice';

const ProjectModal = () => {
  const dispatch = useDispatch();
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      width={'100%'}
      visible={projectModalOpen}
      onClose={() => dispatch(projectListActions.closeProjectModal)}
    >
      <h1>ProjectModal</h1>
      <Button onClick={() => dispatch(projectListActions.closeProjectModal)}>
        Close
      </Button>
    </Drawer>
  );
};

export default ProjectModal;
