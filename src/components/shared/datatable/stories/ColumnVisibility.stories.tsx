import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Datatable from '../Datatable';
import { StandardDatatableComponent } from './Datatable.stories';
import SettingsIcon from '@/assets/icons/SettingsIcon';

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable/ColumnVisibility',
  component: Datatable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

export const ColumnsVisibilityInTitleRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleLocation: 'titleRow',
      }}
      columnVisibility={{
        show: true,
        location: 'titleRow',
        trigger: { label: 'Show/Hide Columns' },
        defaultVisibleColumns: ['employment.title'],
      }}
    />
  ),
};

export const ColumnVisibilityInSearchRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleLocation: 'titleRow',
      }}
      columnVisibility={{
        show: true,
        location: 'searchRow',
        trigger: { label: 'Columns' },
        defaultVisibleColumns: ['employment.title'],
      }}
    />
  ),
};

export const ColumnVisibilityInActionsColumnWithActions: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleLocation: 'titleRow',
      }}
      columnVisibility={{
        show: true,
        location: 'actionsColumn',
        trigger: { label: '' },
        defaultVisibleColumns: ['employment.title'],
      }}
    />
  ),
};

export const ColumnVisibilityInActionsColumnWithoutActions: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (No Actions)',
        titleLocation: 'titleRow',
      }}
      actions={false}
      columnVisibility={{
        show: true,
        location: 'actionsColumn',
        trigger: { label: '' },
        defaultVisibleColumns: ['employment.title'],
      }}
    />
  ),
};

export const WithCustomVisibilityTriggerInTitleRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees',
        titleLocation: 'titleRow',
      }}
      columnVisibility={{
        show: true,
        location: 'titleRow',
        trigger: {
          label: 'Customize Columns',
          icon: <SettingsIcon />,
          style: {
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            padding: '8px 12px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          },
        },
        defaultVisibleColumns: ['employment.title'],
      }}
    />
  ),
};
