import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { StandardDatatableComponent } from './Datatable.stories';

const meta: Meta<typeof StandardDatatableComponent> = {
  title: 'Components/Datatable/Search',
  component: StandardDatatableComponent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof StandardDatatableComponent>;

export const SearchPositionStart: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Search Start)',
      }}
      config={{
        search: {
          searchPosition: 'start',
        },
      }}
    />
  ),
};

export const SearchPositionEnd: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Search End)',
      }}
      config={{
        search: {
          searchPosition: 'end',
        },
      }}
    />
  ),
};

export const HideTableSearch: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (No Search)',
      }}
      config={{
        search: {
          show: false,
        },
      }}
    />
  ),
};

export const FullWidthSearch: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Full Width Search)',
      }}
      config={{
        search: {
          isFullWidth: true,
        },
      }}
    />
  ),
};

export const SearchPlaceholder: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Custom Placeholder)',
      }}
      config={{
        search: {
          placeholder: 'Search employees...',
        },
      }}
    />
  ),
};
