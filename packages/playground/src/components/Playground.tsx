import { ComponentType, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { ErrorSchema, RJSFSchema, RJSFValidationError, UiSchema, ValidatorType } from '@rjsf/utils';
import base64 from '../utils/base64';
import './Playground.css';

import { samples } from '../samples';
import Header, { LiveSettings } from './Header';
import DemoFrame from './DemoFrame';
import ErrorBoundary from './ErrorBoundary';
import GeoPosition from './GeoPosition';
import { ThemesType } from './ThemeSelector';
import Editors from './Editors';
import SpecialInput from './SpecialInput';
import { Sample } from '../samples/Sample';
import Split from 'react-split';
import JsonPathViewer from './JsonPathViewer';

export interface PlaygroundProps {
  themes: { [themeName: string]: ThemesType };
  validators: { [validatorName: string]: ValidatorType };
}

const overrideFormStyle = `
         fieldset[id="root_0"],
         fieldset[id="root_1"],
         fieldset[id="root_2"],
         fieldset[id="root_3"],
         fieldset[id="root_4"],
         fieldset[id="root_5"],
         fieldset[id="root_6"],
         fieldset[id="root_7"],
         fieldset[id="root_8"],
         fieldset[id="root_9"],
         fieldset[id="root_10"],
         fieldset[id="root_11"] {
           border: 1px solid hsl(0, 0%, 88%);
           border-radius: 4px;
           padding: 16px;
           margin-bottom: 16px;
         }
         fieldset#root_0 { background-color: hsl(0, 30%, 95%); }     /* 红色调 */
         fieldset#root_1 { background-color: hsl(180, 30%, 95%); }   /* 青色调 - 红色的对比色 */
         fieldset#root_2 { background-color: hsl(60, 30%, 95%); }    /* 黄色调 */
         fieldset#root_3 { background-color: hsl(240, 25%, 95%); }   /* 蓝色调 - 黄色的对比色 */
         fieldset#root_4 { background-color: hsl(120, 25%, 95%); }   /* 绿色调 */
         fieldset#root_5 { background-color: hsl(300, 25%, 95%); }   /* 紫色调 - 绿色的对比色 */
         fieldset#root_6 { background-color: hsl(30, 30%, 95%); }    /* 橙色调 */
         fieldset#root_7 { background-color: hsl(210, 30%, 95%); }   /* 天蓝调 - 橙色的对比色 */
         fieldset#root_8 { background-color: hsl(90, 25%, 95%); }    /* 黄绿调 */
         fieldset#root_9 { background-color: hsl(270, 25%, 95%); }   /* 紫罗兰 - 黄绿的对比色 */
         fieldset#root_10 { background-color: hsl(150, 25%, 95%); }  /* 青绿调 */
         fieldset#root_11 { background-color: hsl(330, 30%, 95%); }  /* 玫红调 - 青绿的对比色 */
`;

export default function Playground({ themes, validators }: PlaygroundProps) {
  const [loaded, setLoaded] = useState(false);
  const [schema, setSchema] = useState<RJSFSchema>(samples.Simple.schema as RJSFSchema);
  const [uiSchema, setUiSchema] = useState<UiSchema>(samples.Simple.uiSchema!);
  const [formData, setFormData] = useState<any>(samples.Simple.formData);
  const [extraErrors, setExtraErrors] = useState<ErrorSchema | undefined>();
  const [shareURL, setShareURL] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('default');
  const [subtheme, setSubtheme] = useState<string | null>(null);
  const [stylesheet, setStylesheet] = useState<string | null>(null);
  const [validator, setValidator] = useState<string>('AJV8');
  const [showForm, setShowForm] = useState(false);
  const [liveSettings, setLiveSettings] = useState<LiveSettings>({
    showErrorList: 'top',
    liveValidate: true,
    validate: false,
    disabled: false,
    noHtml5Validate: false,
    readonly: false,
    omitExtraData: false,
    liveOmit: false,
    experimental_defaultFormStateBehavior: {
      arrayMinItems: { populate: 'requiredOnly' },
      emptyObjectFields: 'populateRequiredDefaults',
    },
  });
  const [FormComponent, setFormComponent] = useState<ComponentType<FormProps>>(withTheme({}));
  const [otherFormProps, setOtherFormProps] = useState<Partial<FormProps>>({});
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  const playGroundFormRef = useRef<any>(null);

  const onThemeSelected = useCallback(
    (theme: string, { stylesheet, theme: themeObj }: ThemesType) => {
      setTheme(theme);
      setSubtheme(null);
      setFormComponent(withTheme(themeObj));
      setStylesheet(stylesheet);
    },
    [setTheme, setSubtheme, setFormComponent, setStylesheet]
  );

  const load = useCallback(
    (data: Sample & { theme: string; liveSettings: LiveSettings }) => {
      const {
        schema,
        // uiSchema is missing on some examples. Provide a default to
        // clear the field in all cases.
        uiSchema = {},
        // Always reset templates and fields
        templates = {},
        fields = {},
        formData,
        theme: dataTheme = theme,
        extraErrors,
        liveSettings,
        validator,
        ...rest
      } = data;

      // To support mui v6 `material-ui-5` was change to `mui` fix the load to update that as well
      const theTheme = dataTheme === 'material-ui-5' ? 'mui' : dataTheme;
      onThemeSelected(theTheme, themes[theTheme]);

      // force resetting form component instance
      setShowForm(false);
      setSchema(schema);
      setUiSchema(uiSchema);
      setFormData(formData);
      setExtraErrors(extraErrors);
      setTheme(theTheme);
      setShowForm(true);
      setLiveSettings(liveSettings);
      if ('validator' in data) {
        setValidator(validator);
      }
      setOtherFormProps({ fields, templates, ...rest });
    },
    [theme, onThemeSelected, themes]
  );

  useEffect(() => {
    const hash = document.location.hash.match(/#(.*)/);

    if (hash && typeof hash[1] === 'string' && hash[1].length > 0 && !loaded) {
      try {
        const decoded = base64.decode(hash[1]);
        load(JSON.parse(decoded));
        setLoaded(true);
      } catch (error) {
        alert('Unable to load form setup data.');
        console.error(error);
      }

      return;
    }

    // initialize theme
    onThemeSelected(theme, themes[theme]);

    setShowForm(true);
  }, [onThemeSelected, load, loaded, setShowForm, theme, themes]);

  const onFormDataChange = useCallback(
    ({ formData }: IChangeEvent, id?: string) => {
      if (id) {
        console.log('Field changed, id: ', id);
      }

      setFormData(formData);
      setShareURL(null);
    },
    [setFormData, setShareURL]
  );

  const onFormDataSubmit = useCallback(({ formData }: IChangeEvent, event: FormEvent<any>) => {
    console.log('submitted formData', formData);
    console.log('submit event', event);
    window.alert('Form submitted');
  }, []);

  const onFieldHover = useCallback((id: string) => {
    setCurrentPath(id);
  }, []);

  const onFieldBlur = useCallback(() => {
    setCurrentPath(null);
  }, []);

  return (
    <>
      <JsonPathViewer path={currentPath} />
      <Header
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        shareURL={shareURL}
        themes={themes}
        theme={theme}
        subtheme={subtheme}
        validators={validators}
        validator={validator}
        liveSettings={liveSettings}
        playGroundFormRef={playGroundFormRef}
        load={load}
        onThemeSelected={onThemeSelected}
        setSubtheme={setSubtheme}
        setStylesheet={setStylesheet}
        setValidator={setValidator}
        setLiveSettings={setLiveSettings}
        setShareURL={setShareURL}
      />
      <Split className='split'>
        <Editors
          formData={formData}
          setFormData={setFormData}
          schema={schema}
          setSchema={setSchema}
          uiSchema={uiSchema}
          setUiSchema={setUiSchema}
          extraErrors={extraErrors}
          setExtraErrors={setExtraErrors}
          setShareURL={setShareURL}
        />
        <div className='col-sm-5'>
          <ErrorBoundary>
            {showForm && (
              <DemoFrame
                head={
                  <>
                    <link rel='stylesheet' id='theme' href={stylesheet || ''} />
                    <style>{overrideFormStyle}</style>
                  </>
                }
                style={{
                  width: '100%',
                  height: 1000,
                  border: 0,
                }}
                theme={theme}
              >
                <FormComponent
                  {...otherFormProps}
                  {...liveSettings}
                  extraErrors={extraErrors}
                  schema={schema}
                  uiSchema={uiSchema}
                  formData={formData}
                  fields={{
                    geo: GeoPosition,
                    '/schemas/specialString': SpecialInput,
                  }}
                  validator={validators[validator]}
                  onChange={onFormDataChange}
                  onSubmit={onFormDataSubmit}
                  onBlur={() => {
                    onFieldBlur();
                  }}
                  onFocus={(id: string) => {
                    onFieldHover(id);
                  }}
                  onError={(errorList: RJSFValidationError[]) => console.log('errors', errorList)}
                  transformErrors={(errors) => {
                    return errors.filter((error) => {
                      if (error.message === 'must be integer' && typeof error.data === 'bigint') {
                        return false;
                      }
                      return true;
                    });
                  }}
                  ref={playGroundFormRef}
                />
              </DemoFrame>
            )}
          </ErrorBoundary>
        </div>
      </Split>
    </>
  );
}
