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
      search={{
        searchPosition: 'start',
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
      search={{
        searchPosition: 'end',
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
      search={{
        show: false,
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
      search={{
        isFullWidth: true,
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
      search={{
        placeholder: 'Search employees...',
      }}
    />
  ),
};
