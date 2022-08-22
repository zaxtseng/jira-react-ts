import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadDevTools } from 'jira-dev-tool';
// 由于部分样式冲突，务必在 jira-dev-tool 后面引入 antd
import 'antd/dist/antd.less';
import { AppProviders } from 'context';

const root = ReactDOM.createRoot(document.getElementById('root')!);
loadDevTools(() =>
  root.render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
