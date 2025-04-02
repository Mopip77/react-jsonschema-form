import { useCallback, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { ErrorSchema, RJSFSchema, UiSchema } from '@rjsf/utils';
import isEqualWith from 'lodash/isEqualWith';
import { JSONParse, JSONStringify } from 'json-with-bigint';
import './Editors.css';

const monacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
};

type EditorProps = {
  title: string;
  code: string;
  onChange: (code: string) => void;
  enableFullscreen?: boolean;
};

function Editor({ title, code, onChange, enableFullscreen = false }: EditorProps) {
  const [valid, setValid] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onCodeChange = useCallback(
    (code: string | undefined) => {
      if (!code) {
        return;
      }

      try {
        const parsedCode = JSONParse(code);
        setValid(true);
        onChange(parsedCode);
      } catch (err) {
        setValid(false);
      }
    },
    [setValid, onChange]
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const icon = valid ? 'ok' : 'remove';
  const cls = valid ? 'valid' : 'invalid';

  return (
    <>
      <div className={`panel panel-default ${isFullscreen ? 'editor-fullscreen' : ''}`}>
        <div className='panel-heading'>
          <div className='editor-header'>
            <div>
              <span className={`${cls} glyphicon glyphicon-${icon}`} />
              {' ' + title}
            </div>
            {enableFullscreen && (
              <button className='btn btn-sm btn-default' onClick={toggleFullscreen}>
                <span className={`glyphicon glyphicon-${isFullscreen ? 'resize-small' : 'resize-full'}`} />
              </button>
            )}
          </div>
        </div>
        <MonacoEditor
          language='json'
          value={code}
          theme='vs-light'
          onChange={onCodeChange}
          height={isFullscreen ? '90vh' : 400}
          options={monacoEditorOptions}
        />
      </div>
      {isFullscreen && <div className='editor-overlay' onClick={toggleFullscreen} />}
    </>
  );
}

const toJson = (val: unknown) => JSONStringify(val, 2);

type EditorsProps = {
  schema: RJSFSchema;
  setSchema: React.Dispatch<React.SetStateAction<RJSFSchema>>;
  uiSchema: UiSchema;
  setUiSchema: React.Dispatch<React.SetStateAction<UiSchema>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  extraErrors: ErrorSchema | undefined;
  setExtraErrors: React.Dispatch<React.SetStateAction<ErrorSchema | undefined>>;
  setShareURL: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Editors({
  extraErrors,
  formData,
  schema,
  uiSchema,
  setExtraErrors,
  setFormData,
  setSchema,
  setShareURL,
  setUiSchema,
}: EditorsProps) {
  const onSchemaEdited = useCallback(
    (newSchema) => {
      setSchema(newSchema);
      setShareURL(null);
    },
    [setSchema, setShareURL]
  );

  const onUISchemaEdited = useCallback(
    (newUiSchema) => {
      setUiSchema(newUiSchema);
      setShareURL(null);
    },
    [setUiSchema, setShareURL]
  );

  const onFormDataEdited = useCallback(
    (newFormData) => {
      if (
        !isEqualWith(newFormData, formData, (newValue, oldValue) => {
          // Since this is coming from the editor which uses JSON.stringify to trim undefined values compare the values
          // using JSON.stringify to see if the trimmed formData is the same as the untrimmed state
          // Sometimes passing the trimmed value back into the Form causes the defaults to be improperly assigned
          return JSONStringify(oldValue) === JSONStringify(newValue);
        })
      ) {
        setFormData(newFormData);
        setShareURL(null);
      }
    },
    [formData, setFormData, setShareURL]
  );

  const onExtraErrorsEdited = useCallback(
    (newExtraErrors) => {
      setExtraErrors(newExtraErrors);
      setShareURL(null);
    },
    [setExtraErrors, setShareURL]
  );

  return (
    <div className='col-sm-7'>
      <Editor title='JSONSchema' code={toJson(schema)} onChange={onSchemaEdited} enableFullscreen={true} />
      <Editor title='formData' code={toJson(formData)} onChange={onFormDataEdited} enableFullscreen={true} />
      <Editor title='UISchema' code={toJson(uiSchema)} onChange={onUISchemaEdited} enableFullscreen={true} />
      {extraErrors && (
        <div className='row'>
          <div className='col'>
            <Editor
              title='extraErrors'
              code={toJson(extraErrors || {})}
              onChange={onExtraErrorsEdited}
              enableFullscreen={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
