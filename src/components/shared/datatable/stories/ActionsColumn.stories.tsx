import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Datatable from '../Datatable';
import { StandardDatatableComponent } from './Datatable.stories';
import GradientTextColor from '@/components/shared/gradientTextColor/GradientTextColor';

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable/Actions Column',
  component: Datatable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

export const ActionsColumnPositionLast: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Actions on last column)',
      }}
      config={{
        ui: {
          isActionsColumnLast: true,
        },
      }}
    />
  ),
};

export const ActionsColumnLabel: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Custom Actions Label)',
      }}
      config={{
        ui: {
          actionsColWidth: 60,
          actionsColLabel: <GradientTextColor variant="primary">Operations</GradientTextColor>,
        },
      }}
    />
  ),
};
