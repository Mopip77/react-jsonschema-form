import { useEffect, useState, MouseEvent, useCallback } from 'react';
import { JSONParse } from 'json-with-bigint';
import { v4 as uuidv4 } from 'uuid';
import { JSONStringify } from 'json-with-bigint';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { LiveSettings } from './Header';

interface SelectorProps {
  onSelected: (data: any) => void;
}

interface SavedSampleProps {
  name?: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: any;
  liveSettings: LiveSettings;
  validator: any;
}

interface SavedSample {
  id: string;
  name: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: any;
  liveSettings: LiveSettings;
  validator: any;
}

function SaveSampleModal({
  onSave,
  onClose,
  className,
  defaultSampleName,
}: {
  onSave: (name: string) => void;
  onClose: () => void;
  className: string;
  defaultSampleName: string;
}) {
  const [name, setName] = useState(defaultSampleName);
  return (
    <div id='save-sample-modal' className={`modal ${className}`} tabIndex={-1}>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>保存示例</h5>
          </div>
          <form
            onSubmit={(e) => {
              if (e.target instanceof HTMLFormElement) {
                if (e.target.checkValidity() === false) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                onSave(name);
              }
            }}
          >
            <div className='modal-body'>
              <div className='form-row'>
                <label htmlFor='sampleName' className='form-label'>
                  示例名称
                </label>
                <input
                  id='sampleName'
                  type='text'
                  required
                  className='form-control'
                  placeholder='eg: 通用课程门槛'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' onClick={onClose}>
                取消
              </button>
              <button type='submit' className='btn btn-primary'>
                {defaultSampleName === name ? '更新' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DeleteSampleModal({
  onDelete,
  onClose,
  className,
  sampleId,
  sampleName,
}: {
  onDelete: (sampleId: string) => void;
  onClose: () => void;
  className: string;
  sampleId: string;
  sampleName: string;
}) {
  return (
    <div id='delete-sample-modal' className={`modal ${className}`} tabIndex={-1}>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>删除示例</h5>
          </div>
          <div className='modal-body'>
            <p>确定要删除示例【{sampleName}】吗？</p>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={onClose}>
              取消
            </button>
            <button type='button' className='btn btn-danger' onClick={() => onDelete(sampleId)}>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const saveAsSample = ({ name, schema, uiSchema, formData, liveSettings, validator }: SavedSampleProps) => {
  const savedSampleKeys = JSONParse(localStorage.getItem('savedSampleKeys') || '[]');
  const index = savedSampleKeys.findIndex((key: any) => key.name === name);
  const sampleId = index === -1 ? uuidv4() : savedSampleKeys[index].id;

  localStorage.setItem(
    `savedSamples.${sampleId}`,
    JSONStringify({
      id: sampleId,
      name,
      schema,
      uiSchema,
      formData,
      liveSettings,
      validator,
    })
  );

  if (index !== -1) {
    // 更新已存在的样例
    savedSampleKeys[index] = {
      id: sampleId,
      name,
    };
  } else {
    // 在最前面插入新样例
    savedSampleKeys.unshift({
      id: sampleId,
      name,
    });
  }

  localStorage.setItem('savedSampleKeys', JSONStringify(savedSampleKeys));
};

const deleteSample = (sampleId: string) => {
  const savedSampleKeys = JSONParse(localStorage.getItem('savedSampleKeys') || '[]');
  const index = savedSampleKeys.findIndex((key: any) => key.id === sampleId);
  savedSampleKeys.splice(index, 1);
  localStorage.setItem('savedSampleKeys', JSONStringify(savedSampleKeys));

  localStorage.removeItem(`savedSamples.${sampleId}`);
};

const SavedSampleSelector = ({
  onSelected,
  schema,
  uiSchema,
  formData,
  liveSettings,
  validator,
}: SelectorProps & SavedSampleProps) => {
  const [samples, setSamples] = useState<SavedSample[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [currentSampleName, setCurrentSampleName] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const init = useCallback(() => {
    setSelectedSampleId('');
    setCurrentSampleName('');
    updateSamples();
  }, []);

  const updateSamples = () => {
    const savedSampleKeys = localStorage.getItem('savedSampleKeys');
    if (savedSampleKeys) {
      setSamples(JSONParse(savedSampleKeys));
    }
  };

  useEffect(() => {
    init();
  }, [init]);

  const handleSampleClick = (sampleId: string) => {
    return (event: MouseEvent) => {
      event.preventDefault();
      setSelectedSampleId(sampleId);
      setTimeout(() => {
        const savedSample = JSONParse(localStorage.getItem('savedSamples.' + sampleId) || '{}');
        onSelected(savedSample);
        setCurrentSampleName(savedSample.name);
      }, 0);
    };
  };

  return (
    <>
      <hr style={{ margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '10px' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>保存的示例</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedSampleId && (
            <button className='btn btn-danger btn-sm' onClick={() => setShowDeleteModal(true)}>
              删除
            </button>
          )}
          <button className='btn btn-default btn-sm' onClick={() => setShowSaveModal(true)}>
            保存示例
          </button>
          {showSaveModal && (
            <SaveSampleModal
              className={showSaveModal ? 'show' : 'hidden'}
              defaultSampleName={currentSampleName}
              onSave={(name) => {
                saveAsSample({ name, schema, uiSchema, formData, liveSettings, validator });
                updateSamples();
                setShowSaveModal(false);
              }}
              onClose={() => setShowSaveModal(false)}
            />
          )}
          {showDeleteModal && (
            <DeleteSampleModal
              className={showDeleteModal ? 'show' : 'hidden'}
              sampleId={selectedSampleId}
              sampleName={currentSampleName}
              onDelete={(sampleId) => {
                deleteSample(sampleId);
                init();
                setShowDeleteModal(false);
              }}
              onClose={() => setShowDeleteModal(false)}
            />
          )}
        </div>
      </div>
      <hr style={{ margin: '10px 0' }} />
      <div>
        {(samples.length > 0 && (
          <ul className='nav nav-pills'>
            {samples.map((sample: SavedSample) => (
              <li key={sample.id} role='presentation' className={selectedSampleId === sample.id ? 'active' : ''}>
                <a href='#' onClick={handleSampleClick(sample.id)}>
                  {sample.name}
                </a>
              </li>
            ))}
          </ul>
        )) || <span style={{ color: 'gray' }}>没有保存的示例</span>}
      </div>
    </>
  );
};

export default SavedSampleSelector;
