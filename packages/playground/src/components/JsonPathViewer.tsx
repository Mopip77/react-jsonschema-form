import React from 'react';
import './JsonPathViewer.css';

interface JsonPathViewerProps {
  path: string | null;
}

const convertToJsonPath = (path: string): string => {
  if (!path) {
    return '';
  }

  // 移除 root_ 前缀
  const pathWithoutRoot = path.replace(/^root_/, '');

  // 将路径分割成片段
  const segments = pathWithoutRoot.split('_');

  let result = '$';

  segments.forEach((segment) => {
    // 检查是否是数组索引（纯数字）
    if (/^\d+$/.test(segment)) {
      result += `[${segment}]`;
    } else {
      result += '.';
      result += segment;
    }
  });

  return result;
};

const JsonPathViewer: React.FC<JsonPathViewerProps> = ({ path }) => {
  if (!path) {
    return null;
  }

  const formattedPath = convertToJsonPath(path);

  return (
    <div className='json-path-viewer'>
      <span>Path: {formattedPath}</span>
    </div>
  );
};

export default JsonPathViewer;
