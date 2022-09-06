import { Button, Drawer } from 'antd';
import { useProjectModal } from './utils';

const ProjectModal = () => {
  const { projectModalOpen, close } = useProjectModal();
  return (
    <Drawer width={'100%'} visible={projectModalOpen} onClose={close}>
      <h1>ProjectModal</h1>
      <Button onClick={close}>Close</Button>
    </Drawer>
  );
};

export default ProjectModal;
