import {
  WidgetProps,
  getTemplate,
  localToSimpleDateString,
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  simpleDateStringToLocal,
} from '@rjsf/utils';

export default function DateTimeWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
  const { registry } = props;
  const uiProps: any = props.options['props'] || {};
  const options = {
    ...props.options,
    props: {
      type: 'datetime-local',
      ...uiProps,
    },
  };
  const BaseInputTemplate = getTemplate<'BaseInputTemplate', T, S, F>('BaseInputTemplate', registry, options);

  const value = simpleDateStringToLocal(props.value);
  const onChange = (value: any) => {
    props.onChange(localToSimpleDateString(value));
  };
  // TODO: rows and columns.
  return <BaseInputTemplate {...props} options={options} value={value} onChange={onChange} />;
}
