import { useState } from 'react';

function ChangelogModal({ onClose, className }: { onClose: () => void; className: string }) {
  return (
    <div id='changelog-modal' className={`modal ${className}`} tabIndex={-1}>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>调整内容</h5>
          </div>
          <div className='modal-body'>
            <ol>
              <li>🌟 支持保存示例</li>
              <li>🌟 支持调整宽度</li>
              <li>🌟 支持展示当前输入框 JSON Path</li>
              <li>🌟 优化展示 array 的背景颜色，便于区分</li>
              <li>🐞 修复 bigint 精度问题</li>
              <li>🛠️ 【Live validation】默认开启</li>
              <li>🛠️ 数组中没有元素默认不生成数组字段(Populate minItems in arrays -{'>'} requiredOnly)</li>
              <li>
                🛠️ 如果父元素不是 required , 则不生成 reqired 子元素字段(Object fields default behavior -{'>'}{' '}
                populateRequiredDefaults)
              </li>
              <li>🛠️ 【DateTimeWidget】时间格式改为 yyyy-MM-dd HH:mm:ss</li>
            </ol>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={onClose}>
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [showChangelogModal, setShowChangelogModal] = useState(false);

  return (
    <div className='col-sm-12'>
      <p style={{ textAlign: 'center' }}>
        Powered by <a href='https://github.com/rjsf-team/react-jsonschema-form'>react-jsonschema-form</a>
        {' · '}
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setShowChangelogModal(true);
          }}
        >
          changelog
        </a>
        {import.meta.env.VITE_SHOW_NETLIFY_BADGE === 'true' && (
          <div style={{ float: 'right' }}>
            <a href='https://www.netlify.com'>
              <img src='https://www.netlify.com/img/global/badges/netlify-color-accent.svg' />
            </a>
          </div>
        )}
      </p>
      {showChangelogModal && (
        <ChangelogModal
          className={showChangelogModal ? 'show' : 'hidden'}
          onClose={() => setShowChangelogModal(false)}
        />
      )}
    </div>
  );
}
