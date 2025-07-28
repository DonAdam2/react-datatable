import type { Preview } from '@storybook/react-webpack5';
import { withRouter } from './decorators';
import '../src/scss/global.scss';

const preview: Preview = {
  decorators: [withRouter],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
