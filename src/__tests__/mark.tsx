import { renderHook } from '@testing-library/react-hooks';
import { screen } from '@testing-library/react';
import { Mark } from '../components/mark';

test('Mark组件正确高亮关键词', () => {
  const name = '物料管理';
  const keyword = '管理';

  renderHook(() => <Mark name={name} keyword={keyword} />);

  // 期望keyword存在document中
  expect(screen.getByText(keyword)).toBeInTheDocument();
  expect(screen.getByText(keyword)).toHaveStyle('color: #257AFD');
  // 期望其他字没有高亮颜色
  expect(screen.getByText('物料')).not.toHaveStyle('color: #257AFD');
});
