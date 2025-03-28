import { Theme as MuiV4Theme } from '@rjsf/material-ui';
import { Theme as MuiV5Theme } from '@rjsf/mui';
import { Theme as FluentUITheme } from '@rjsf/fluent-ui';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import { Theme as SuiTheme } from '@rjsf/semantic-ui';
import { Theme as AntdTheme } from '@rjsf/antd';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Theme as ChakraUITheme } from '@rjsf/chakra-ui';
import v8Validator, { customizeValidator } from '@rjsf/validator-ajv8';
import v6Validator from '@rjsf/validator-ajv6';
import localize_es from 'ajv-i18n/localize/es';
import Ajv2019 from 'ajv/dist/2019.js';
import Ajv2020 from 'ajv/dist/2020.js';

import Layout from './layout';
import Playground, { PlaygroundProps } from './components';

// @ts-expect-error todo: error TS2345: Argument of type 'Localize' is not assignable to parameter of type 'Localizer'.
const esV8Validator = customizeValidator({}, localize_es);
const AJV8_2019 = customizeValidator({ AjvClass: Ajv2019 });
const AJV8_2020 = customizeValidator({ AjvClass: Ajv2020 });
const AJV8_DISC = customizeValidator({ ajvOptionsOverrides: { discriminator: true } });
const AJV8_DATA_REF = customizeValidator({ ajvOptionsOverrides: { $data: true } });

const validators: PlaygroundProps['validators'] = {
  AJV8: v8Validator,
  'AJV8 $data reference': AJV8_DATA_REF,
  'AJV8 (discriminator)': AJV8_DISC,
  AJV8_es: esV8Validator,
  AJV8_2019,
  AJV8_2020,
  'AJV6 (deprecated)': v6Validator,
};

const themes: PlaygroundProps['themes'] = {
  default: {
    stylesheet: 'http://fastly.jsdelivr.net/npm/bootstrap@3.3.6/dist/css/bootstrap.min.css',
    theme: {},
    subthemes: {
      cerulean: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/cerulean/bootstrap.min.css',
      },
      cosmo: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/cosmo/bootstrap.min.css',
      },
      cyborg: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/cyborg/bootstrap.min.css',
      },
      darkly: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/darkly/bootstrap.min.css',
      },
      flatly: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/flatly/bootstrap.min.css',
      },
      journal: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/journal/bootstrap.min.css',
      },
      lumen: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/lumen/bootstrap.min.css',
      },
      paper: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/paper/bootstrap.min.css',
      },
      readable: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/readable/bootstrap.min.css',
      },
      sandstone: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/sandstone/bootstrap.min.css',
      },
      simplex: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/simplex/bootstrap.min.css',
      },
      slate: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/slate/bootstrap.min.css',
      },
      spacelab: {
        stylesheet: 'http://fastly.jsdelivr.net/npm/bootswatch@3.3.6/spacelab/bootstrap.min.css',
      },
      'solarized-dark': {
        stylesheet: '//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-dark.css',
      },
      'solarized-light': {
        stylesheet: '//cdn.rawgit.com/aalpern/bootstrap-solarized/master/bootstrap-solarized-light.css',
      },
      superhero: {
        stylesheet: 'https://fastly.jsdelivr.net/npm/bootswatch@3.3.6/superhero/bootstrap.min.css',
      },
      united: {
        stylesheet: 'https://fastly.jsdelivr.net/npm/bootswatch@3.3.6/united/bootstrap.min.css',
      },
      yeti: {
        stylesheet: 'https://fastly.jsdelivr.net/npm/bootswatch@3.3.6/yeti/bootstrap.min.css',
      },
    },
  },
  antd: {
    stylesheet: 'https://fastly.jsdelivr.net/npm/antd@4.1.4/dist/antd.min.css',
    theme: AntdTheme,
  },
  'bootstrap-4': {
    stylesheet: 'https://fastly.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css',
    theme: Bootstrap4Theme,
  },
  'chakra-ui': {
    stylesheet: '',
    theme: ChakraUITheme,
  },
  'fluent-ui': {
    stylesheet: '//static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css',
    theme: FluentUITheme,
  },
  'fluentui-rc': {
    stylesheet: '',
    theme: FluentUIRCTheme,
  },
  'material-ui-4': {
    stylesheet: '',
    theme: MuiV4Theme,
  },
  mui: {
    stylesheet: '',
    theme: MuiV5Theme,
  },
  'semantic-ui': {
    stylesheet: '//fastly.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css',
    theme: SuiTheme,
  },
};

export default function App() {
  return (
    <Layout>
      <Playground themes={themes} validators={validators} />
    </Layout>
  );
}
