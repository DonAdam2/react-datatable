import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/assets': path.resolve(__dirname, '../src/assets'),
        '@/constants': path.resolve(__dirname, '../src/constants'),
        '@/managers': path.resolve(__dirname, '../src/managers'),
        '@/routing': path.resolve(__dirname, '../src/routing'),
        '@/store': path.resolve(__dirname, '../src/store'),
        '@/services': path.resolve(__dirname, '../src/services'),
        '@/hooks': path.resolve(__dirname, '../src/hooks'),
        '@/pages': path.resolve(__dirname, '../src/pages'),
        '@/components': path.resolve(__dirname, '../src/components'),
        '@/scss': path.resolve(__dirname, '../src/scss'),
        '@/public': path.resolve(__dirname, '../public'),
      };
    }

    // Add SCSS support
    config.module?.rules?.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: [path.resolve(__dirname, '../src/scss')],
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../src'),
    });

    return config;
  },
};
export default config;
