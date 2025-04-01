export default function Footer() {
  return (
    <div className='col-sm-12'>
      <p style={{ textAlign: 'center' }}>
        Powered by <a href='https://github.com/rjsf-team/react-jsonschema-form'>react-jsonschema-form</a>.
        {import.meta.env.VITE_SHOW_NETLIFY_BADGE === 'true' && (
          <div style={{ float: 'right' }}>
            <a href='https://www.netlify.com'>
              <img src='https://www.netlify.com/img/global/badges/netlify-color-accent.svg' />
            </a>
          </div>
        )}
      </p>
      <hr />
      <div style={{ margin: '10px 0', borderRadius: '0.25rem' }}>
        <h4>调整内容</h4>
        <ol>
          <li>🌟 支持保存示例</li>
          <li>🌟 支持调整宽度</li>
          <li>🐞 修复 bigint 精度问题</li>
          <li>🛠️ 【Live validation】默认开启</li>
          <li>🛠️ 数组中没有元素默认不生成数组字段(Populate minItems in arrays -{'>'} requiredOnly)</li>
          <li>
            🛠️ 如果父元素不是 required , 则不生成 reqired 子元素字段(Object fields default behavior -{'>'}{' '}
            populateRequiredDefaults)
          </li>
        </ol>
      </div>
    </div>
  );
}
