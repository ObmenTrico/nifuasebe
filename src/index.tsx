import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
  WebAppProvider,
} from '@vkruglikov/react-telegram-web-app';
import 'antd/dist/reset.css';
import {BrowserRouter} from "react-router-dom";
import './index.css';
import { App } from "./app"

const Index = () => {
  const [smoothButtonsTransition, setSmoothButtonsTransition] = useState(false);

  return (
      <BrowserRouter>
        <WebAppProvider options={{ smoothButtonsTransition }}>
          <App
            onChangeTransition={() => setSmoothButtonsTransition(state => !state)}
          />
        </WebAppProvider>
      </BrowserRouter>
  );
};

ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
).render(<Index />);
