import { useCallback, useState } from 'react';
import Form, { IChangeEvent } from '@rjsf/core';
import { RJSFSchema, UiSchema, ValidatorType } from '@rjsf/utils';
import localValidator from '@rjsf/validator-ajv8';
import base64 from '../utils/base64';

import CopyLink from './CopyLink';
import ThemeSelector, { ThemesType } from './ThemeSelector';
import ValidatorSelector from './ValidatorSelector';
import SubthemeSelector from './SubthemeSelector';
import RawValidatorTest from './RawValidatorTest';
import SavedSampleSelector from './SavedSampleSelector';
import { v4 as uuidv4 } from 'uuid';
import { JSONStringify, JSONParse } from 'json-with-bigint';

const HeaderButton: React.FC<
  {
    title: string;
    onClick: () => void;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ title, onClick, children, ...buttonProps }) => {
  return (
    <button type='button' className='btn btn-default' title={title} onClick={onClick} {...buttonProps}>
      {children}
    </button>
  );
};

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
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function HeaderButtons({
  playGroundFormRef,
  saveAsSample,
  currentSampleName,
}: {
  playGroundFormRef: React.MutableRefObject<any>;
  saveAsSample: (name: string) => void;
  currentSampleName: string;
}) {
  const [showSaveModal, setShowSaveModal] = useState(false);

  return (
    <>
      <label className='control-label'>Programmatic</label>
      <div className='btn-group'>
        <HeaderButton
          title='Click me to submit the form programmatically.'
          onClick={() => playGroundFormRef.current.submit()}
        >
          Submit
        </HeaderButton>
        <HeaderButton
          title='Click me to validate the form programmatically.'
          onClick={() => playGroundFormRef.current.validateForm()}
        >
          Validate
        </HeaderButton>
        <HeaderButton
          title='Click me to reset the form programmatically.'
          onClick={() => playGroundFormRef.current.reset()}
        >
          Reset
        </HeaderButton>
        <HeaderButton
          title='Click me to save the form programmatically.'
          onClick={() => {
            console.log('show save modal');
            setShowSaveModal(true);
          }}
        >
          Save
        </HeaderButton>
      </div>
      {showSaveModal && (
        <SaveSampleModal
          className={showSaveModal ? 'show' : 'hidden'}
          defaultSampleName={currentSampleName}
          onSave={(name) => {
            saveAsSample(name);
            setShowSaveModal(false);
          }}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </>
  );
}

const liveSettingsBooleanSchema: RJSFSchema = {
  type: 'object',
  properties: {
    liveValidate: { type: 'boolean', title: 'Live validation' },
    disabled: { type: 'boolean', title: 'Disable whole form' },
    readonly: { type: 'boolean', title: 'Readonly whole form' },
    omitExtraData: { type: 'boolean', title: 'Omit extra data' },
    liveOmit: { type: 'boolean', title: 'Live omit' },
    noValidate: { type: 'boolean', title: 'Disable validation' },
    noHtml5Validate: { type: 'boolean', title: 'Disable HTML 5 validation' },
    focusOnFirstError: { type: 'boolean', title: 'Focus on 1st Error' },
    showErrorList: {
      type: 'string',
      default: 'top',
      title: 'Show Error List',
      enum: [false, 'top', 'bottom'],
    },
  },
};

const liveSettingsSelectSchema: RJSFSchema = {
  type: 'object',
  properties: {
    experimental_defaultFormStateBehavior: {
      title: 'Default Form State Behavior (Experimental)',
      type: 'object',
      properties: {
        arrayMinItems: {
          type: 'object',
          properties: {
            populate: {
              type: 'string',
              default: 'populate',
              title: 'Populate minItems in arrays',
              oneOf: [
                {
                  type: 'string',
                  title: 'Populate remaining minItems with default values (legacy behavior)',
                  enum: ['all'],
                },
                {
                  type: 'string',
                  title: 'Only populate minItems with default values when field is required',
                  enum: ['requiredOnly'],
                },
                {
                  type: 'string',
                  title: 'Never populate minItems with default values',
                  enum: ['never'],
                },
              ],
            },
            mergeExtraDefaults: {
              title: 'Merge array defaults with formData',
              type: 'boolean',
              default: false,
            },
          },
        },
        allOf: {
          type: 'string',
          title: 'allOf defaults behaviour',
          default: 'skipDefaults',
          oneOf: [
            {
              type: 'string',
              title: 'Populate defaults with allOf',
              enum: ['populateDefaults'],
            },
            {
              type: 'string',
              title: 'Skip populating defaults with allOf',
              enum: ['skipDefaults'],
            },
          ],
        },
        constAsDefaults: {
          type: 'string',
          title: 'const as default behavior',
          default: 'always',
          oneOf: [
            {
              type: 'string',
              title: 'A const value will always be merged into the form as a default',
              enum: ['always'],
            },
            {
              type: 'string',
              title: 'If const is in a `oneOf` it will NOT pick the first value as a default',
              enum: ['skipOneOf'],
            },
            {
              type: 'string',
              title: 'A const value will never be used as a default',
              enum: ['never'],
            },
          ],
        },
        emptyObjectFields: {
          type: 'string',
          title: 'Object fields default behavior',
          default: 'populateAllDefaults',
          oneOf: [
            {
              type: 'string',
              title:
                'Assign value to formData when default is primitive, non-empty object field, or is required (legacy behavior)',
              enum: ['populateAllDefaults'],
            },
            {
              type: 'string',
              title:
                'Assign value to formData when default is an object and parent is required, or default is primitive and is required',
              enum: ['populateRequiredDefaults'],
            },
            {
              type: 'string',
              title: 'Assign value to formData when only default is set',
              enum: ['skipEmptyDefaults'],
            },
            {
              type: 'string',
              title: 'Does not set defaults',
              enum: ['skipDefaults'],
            },
          ],
        },
        mergeDefaultsIntoFormData: {
          type: 'string',
          title: 'Merge defaults into formData',
          default: 'useFormDataIfPresent',
          oneOf: [
            {
              type: 'string',
              title: 'Use undefined field value if present',
              enum: ['useFormDataIfPresent'],
            },
            {
              type: 'string',
              title: 'Use default for undefined field value',
              enum: ['useDefaultIfFormDataUndefined'],
            },
          ],
        },
      },
    },
  },
};

const liveSettingsBooleanUiSchema: UiSchema = {
  showErrorList: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true,
    },
  },
};

const liveSettingsSelectUiSchema: UiSchema = {
  experimental_defaultFormStateBehavior: {
    'ui:options': {
      label: false,
    },
    arrayMinItems: {
      'ui:options': {
        label: false,
      },
    },
  },
};

export interface LiveSettings {
  showErrorList: false | 'top' | 'bottom';
  [key: string]: any;
}

type HeaderProps = {
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: any;
  shareURL: string | null;
  themes: { [themeName: string]: ThemesType };
  theme: string;
  subtheme: string | null;
  validators: {
    [validatorName: string]: ValidatorType<any, RJSFSchema, any>;
  };
  validator: string;
  liveSettings: LiveSettings;
  playGroundFormRef: React.MutableRefObject<any>;
  load: (data: any) => void;
  onThemeSelected: (theme: string, themeObj: ThemesType) => void;
  setSubtheme: React.Dispatch<React.SetStateAction<string | null>>;
  setStylesheet: React.Dispatch<React.SetStateAction<string | null>>;
  setValidator: React.Dispatch<React.SetStateAction<string>>;
  setLiveSettings: React.Dispatch<React.SetStateAction<LiveSettings>>;
  setShareURL: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Header({
  schema,
  uiSchema,
  formData,
  shareURL,
  themes,
  theme,
  subtheme,
  validators,
  validator,
  liveSettings,
  playGroundFormRef,
  load,
  onThemeSelected,
  setSubtheme,
  setStylesheet,
  setValidator,
  setLiveSettings,
  setShareURL,
}: HeaderProps) {
  const [currentSampleName, setCurrentSampleName] = useState('');

  const onSubthemeSelected = useCallback(
    (subtheme: any, { stylesheet }: { stylesheet: any }) => {
      setSubtheme(subtheme);
      setStylesheet(stylesheet);
    },
    [setSubtheme, setStylesheet]
  );

  const onValidatorSelected = useCallback(
    (validator: string) => {
      setValidator(validator);
    },
    [setValidator]
  );

  const handleSetLiveSettings = useCallback(
    ({ formData }: IChangeEvent) => {
      setLiveSettings((previousLiveSettings) => ({ ...previousLiveSettings, ...formData }));
    },
    [setLiveSettings]
  );

  const onShare = useCallback(() => {
    const {
      location: { origin, pathname },
    } = document;

    try {
      const hash = base64.encode(
        JSON.stringify({
          formData,
          schema,
          uiSchema,
          theme,
          liveSettings,
          validator,
        })
      );

      setShareURL(`${origin}${pathname}#${hash}`);
    } catch (error) {
      setShareURL(null);
      console.error(error);
    }
  }, [formData, liveSettings, schema, theme, uiSchema, validator, setShareURL]);

  const saveAsSample = useCallback(
    (name: string) => {
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
    },
    [formData, liveSettings, schema, uiSchema, validator]
  );

  return (
    <div className='page-header'>
      <h1>jsonschema-表单编辑器</h1>
      <div className='row'>
        <div className='col-sm-4'>
          <SavedSampleSelector onSelected={load} onSelectedName={setCurrentSampleName} />
        </div>
        <div className='col-sm-2'>
          <Form
            idPrefix='rjsf_options'
            schema={liveSettingsBooleanSchema}
            formData={liveSettings}
            validator={localValidator}
            onChange={handleSetLiveSettings}
            uiSchema={liveSettingsBooleanUiSchema}
          >
            <div />
          </Form>
        </div>
        <div className='col-sm-2'>
          <Form
            idPrefix='rjsf_options'
            schema={liveSettingsSelectSchema}
            formData={liveSettings}
            validator={localValidator}
            onChange={handleSetLiveSettings}
            uiSchema={liveSettingsSelectUiSchema}
          >
            <div />
          </Form>
        </div>
        <div className='col-sm-2'>
          <ThemeSelector themes={themes} theme={theme} select={onThemeSelected} />
          {themes[theme] && themes[theme].subthemes && (
            <SubthemeSelector subthemes={themes[theme].subthemes!} subtheme={subtheme} select={onSubthemeSelected} />
          )}
          <ValidatorSelector validators={validators} validator={validator} select={onValidatorSelected} />
          <HeaderButtons
            playGroundFormRef={playGroundFormRef}
            saveAsSample={saveAsSample}
            currentSampleName={currentSampleName}
          />
          <div style={{ marginTop: '5px' }} />
          <CopyLink shareURL={shareURL} onShare={onShare} />
        </div>
        <div className='col-sm-2'>
          <RawValidatorTest validator={validators[validator]} schema={schema} formData={formData} />
        </div>
      </div>
    </div>
  );
}
