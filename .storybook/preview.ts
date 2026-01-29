import type { Preview } from '@storybook/react';
import '../src/styles/global.scss';
// Design System Component styles
import '../src/components/common/Button/styles.scss';
import '../src/components/common/TextField/styles.scss';
import '../src/components/common/Checkbox/styles.scss';
import '../src/components/common/Select/styles.scss';
import '../src/components/common/StepIndicator/styles.scss';
import '../src/components/common/Tab/styles.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#151515' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default preview;