import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { DragEvent, MouseEvent } from 'react';

import { Person } from '@/constants/FakeBackend';
import { RowInfo } from '@/components/shared/datatable/Datatable.types';
import { StandardDatatableComponent } from './Datatable.stories';
import EditIcon from '@/assets/icons/EditIcon';

const meta: Meta<typeof StandardDatatableComponent> = {
  title: 'Components/Datatable/Row Events',
  component: StandardDatatableComponent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof StandardDatatableComponent>;

export const WithOnRowClick: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Click on active rows)',
      }}
      rowEvents={{
        onClick: {
          // Only enable click for active users
          clickable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'active',
          event: (e: MouseEvent, { original, getValue }: RowInfo<Person>) => {
            console.log('Row clicked:', getValue('first_name'), getValue('last_name'));
            alert(
              `Clicked on ${getValue('first_name')} ${getValue('last_name')} (${getValue('employment.title')})`
            );
          },
        },
      }}
    />
  ),
};

export const WithOnRowDoubleClick: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Double Click on any row)',
      }}
      rowEvents={{
        onDoubleClick: {
          // Enable double click for all users
          clickable: true,
          event: (e: MouseEvent, { original, getValue }: RowInfo<Person>) => {
            console.log('Row double-clicked:', getValue('first_name'), getValue('last_name'));
            alert(
              `Double-clicked on ${getValue('first_name')} ${getValue('last_name')}\nID: ${getValue('id')}\nStatus: ${getValue('subscription.status')}`
            );
          },
        },
      }}
    />
  ),
};

export const WithOnRowDragAndDrop: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Drag active rows to idle rows)',
      }}
      rowEvents={{
        onDrop: {
          droppable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'idle',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dropped! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
            alert(`Dropped employee: ${getValue('first_name')} ${getValue('last_name')}`);
          },
        },
        onDragStart: {
          draggable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'active',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dragged! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
          },
        },
      }}
    />
  ),
};

export const WithRowDragAndCustomIcon: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Drag active rows to idle rows)',
      }}
      rowEvents={{
        onDrop: {
          droppable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'idle',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dropped! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
            alert(`Dropped employee: ${getValue('first_name')} ${getValue('last_name')}`);
          },
        },
        onDragStart: {
          icon: <EditIcon />,
          draggable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'active',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dragged! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
          },
        },
      }}
    />
  ),
};

export const WithCustomDragPreview: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Drag active rows - custom preview)',
      }}
      rowEvents={{
        onDrop: {
          droppable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'idle',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dropped! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
            alert(`Dropped employee: ${getValue('first_name')} ${getValue('last_name')}`);
          },
        },
        onDragStart: {
          draggable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'active',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dragged! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
          },
          // Render a custom drag preview instead of cloning the full row
          preview: ({ getValue }: RowInfo<Person>) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: '#1f2937',
                color: '#fff',
                borderRadius: 8,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              <EditIcon />
              <span>
                Moving {getValue('first_name')} {getValue('last_name')}
              </span>
            </div>
          ),
          // Anchor the preview slightly below-right of the cursor
          previewOffset: { x: 10, y: 10 },
        },
      }}
    />
  ),
};

export const CustomDragDropStyles: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Custom Drag & Drop Styles Demo',
      }}
      rowEvents={{
        onDrop: {
          droppable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'idle',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dropped! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
            alert(`Dropped employee: ${getValue('first_name')} ${getValue('last_name')}`);
          },
          className: 'custom-drop-zone', // Custom orange styling for drop zones
        },
        onDragStart: {
          draggable: ({ original, getValue }: RowInfo<Person>) =>
            getValue('subscription.status').toLowerCase() === 'active',
          event: (e: DragEvent, { original, getValue }: RowInfo<Person>) => {
            console.log(
              `Row dragged! Employee: ${getValue('first_name')} ${getValue('last_name')}`
            );
          },
          className: 'custom-drag-style', // Custom red styling for draggable rows
        },
      }}
    />
  ),
};
