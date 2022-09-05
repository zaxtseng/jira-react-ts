/**
 * 将project-list的状态切片
 */

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface State {
  projectModalOpen: boolean;
}

const initialState: State = {
  projectModalOpen: false,
};

export const projectListSlice = createSlice({
  name: 'projectListSlice',
  initialState,
  reducers: {
    //这里不再使用switch方式切换不同type,直接使用函数
    // 此处可以直接赋值时因为存在不可变数据immer的处理
    openProjectModal(state) {
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
  },
});

export const projectListActions = projectListSlice.actions;

export const selectProjectModalOpen = (state: RootState) =>
  state.projectList.projectModalOpen;
