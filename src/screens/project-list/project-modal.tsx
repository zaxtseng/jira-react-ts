import { Button, Drawer } from 'antd';

const ProjectModal = ({
  projectModalOpen,
  onClose,
}: {
  projectModalOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer width={'100%'} visible={projectModalOpen} onClose={onClose}>
      <h1>ProjectModal</h1>
      <Button onClick={onClose}>Close</Button>
    </Drawer>
  );
};

export default ProjectModal;
