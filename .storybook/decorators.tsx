import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Decorator } from '@storybook/react';

export const withRouter: Decorator = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);
