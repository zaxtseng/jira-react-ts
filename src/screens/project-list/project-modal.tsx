import { Button, Drawer, Form, Input, Spin } from 'antd';
import { UserSelect } from 'components/user-select';
import { useProjectModal, useProjectsQueryKey } from './utils';
import { useEditProject } from 'utils/project';
import { useAddProject } from '../../utils/project';
import { useEffect } from 'react';
import { ErrorBox } from 'components/lib';
import { useForm } from 'antd/lib/form/Form';
import styled from '@emotion/styled';

const ProjectModal = () => {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectModal();

  const title = editingProject ? '编辑项目' : '新建项目';
  const useMutateProject = editingProject ? useEditProject : useAddProject;
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());
  // 获取表单，重置表单
  const [form] = useForm();
  const onFinish = (values: any) => {
    console.log('...editingProject, ...values: ', {
      ...editingProject,
      ...values,
    });
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      forceRender={true}
      width={'100%'}
      visible={projectModalOpen}
      onClose={close}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <Container>
          <h1>{title}</h1>
          <ErrorBox error={error} />
          <Form
            form={form}
            layout="vertical"
            style={{ width: '40rem' }}
            onFinish={onFinish}
          >
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入项目名' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>
            <Form.Item
              label="部门"
              name="organization"
              rules={[{ required: true, message: '请输入项目名' }]}
            >
              <Input placeholder="请输入部门" />
            </Form.Item>
            <Form.Item label="负责人" name="personId">
              <UserSelect defaultOptionName="负责人" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button loading={mutateLoading} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Container>
      )}
    </Drawer>
  );
};

const Container = styled.div`
  flex-direction: column;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ProjectModal;
