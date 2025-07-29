import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Datatable from '../Datatable';
import { StandardDatatableComponent } from '@/components/shared/datatable/stories/Datatable.stories';

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable/TitleAndTitleButtons',
  component: Datatable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

// Title Position Stories
export const TitlePositionStart: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Title Start)',
        titlePosition: 'start',
        titleLocation: 'titleRow',
      }}
    />
  ),
};

export const TitlePositionEnd: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Title End)',
        titlePosition: 'end',
        titleLocation: 'titleRow',
      }}
    />
  ),
};

export const TitleLocationSearchRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Title in Search Row)',
        titleLocation: 'searchRow',
      }}
    />
  ),
};

// Title Button Stories
export const TitleButtonsPositionStart: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleButtons: [
          { label: 'Export', onClick: () => alert('Export clicked') },
          { label: 'Import', onClick: () => alert('Import clicked') },
        ],
        titleButtonsPosition: 'start',
        titleButtonsLocation: 'titleRow',
      }}
    />
  ),
};

export const TitleButtonsPositionEnd: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleButtons: [
          { label: 'Export', onClick: () => alert('Export clicked') },
          { label: 'Import', onClick: () => alert('Import clicked') },
        ],
        titleButtonsPosition: 'end',
        titleButtonsLocation: 'titleRow',
      }}
    />
  ),
};

export const TitleButtonsLocationSearchRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleLocation: 'titleRow',
        titleButtons: [
          { label: 'Export', onClick: () => alert('Export clicked') },
          { label: 'Import', onClick: () => alert('Import clicked') },
        ],
        titleButtonsLocation: 'searchRow',
      }}
    />
  ),
};
