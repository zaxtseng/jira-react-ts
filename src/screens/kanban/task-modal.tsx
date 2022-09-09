import { useForm } from 'antd/es/form/Form';
import { useDeleteTask, useEditTask } from 'utils/task';
import { useTaskModal, useTasksQueryKey } from './utils';
import { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { UserSelect } from 'components/user-select';
import { TaskTypeSelect } from 'components/task-type-select';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
export const TaskModal = () => {
  const [form] = useForm();
  const { editingTaskId, editingTask, close } = useTaskModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  // 添加一个删除任务的方法
  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey());

  const onCancel = () => {
    close();
    form.resetFields();
  };
  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const startDelete = () => {
    close();
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '你确定删除任务吗？',
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      okText={'确认'}
      cancelText={'取消'}
      confirmLoading={editLoading}
      title={'编辑任务'}
      visible={!!editingTaskId}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label={'任务名'}
          name={'name'}
          rules={[{ required: true, message: '请输入任务名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'经办人'}
          name={'processorId'}
          rules={[{ required: true, message: '请输入任务名' }]}
        >
          <UserSelect defaultOptionName={'经办人'} />
        </Form.Item>
        <Form.Item
          label={'类型'}
          name={'typeId'}
          rules={[{ required: true, message: '请输入任务名' }]}
        >
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{ fontSize: '14px' }}
          size={'small'}
          onClick={startDelete}
        >
          删除
        </Button>
      </div>
    </Modal>
  );
};
