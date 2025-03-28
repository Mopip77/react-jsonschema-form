import { render } from 'react-dom';
import { loader } from '@monaco-editor/react';

import App from './app';

// 配置 Monaco Editor 加载器
loader.config({
  paths: {
    vs: 'https://fastly.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
  },
  'vs/nls': {
    availableLanguages: {},
  },
});

render(<App />, document.getElementById('app'));
