import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Decorator } from '@storybook/react-webpack5';

export const withRouter: Decorator = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);
