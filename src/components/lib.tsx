import styled from '@emotion/styled';
import { Spin, Typography, Button } from 'antd';
import { DevTools } from 'jira-dev-tool';

interface RowProps {
  gap?: number | boolean;
  between?: boolean;
  marginBottom?: number;
}

export const Row = styled.div<RowProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? 'space-between' : undefined)};
  margin-bottom: ${(props) => props.marginBottom + 'rem'};
  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      typeof props.gap === 'number'
        ? props.gap + 'rem'
        : props.gap
        ? '2rem'
        : undefined};
  }
`;

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// 全局loading
export const FullPageLoading = () => (
  <FullPage>
    <Spin size="large" />
  </FullPage>
);
// 全局error
export const FullPageErrorFallback = ({ error }: { error: Error | null }) => (
  <FullPage>
    <DevTools />
    <ErrorBox error={error} />
  </FullPage>
);

// 类型守卫(当符合条件时,value就是Error类型)
const isError = (value: any): value is Error => value?.message;

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text type="danger">{error?.message}</Typography.Text>;
  }

  return null;
};
export const ButtonNoPadding = styled(Button)`
  padding: 0;
`;
