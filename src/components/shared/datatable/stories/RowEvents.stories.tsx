import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { DragEvent, MouseEvent } from 'react';

import { Person } from '@/constants/FakeBackend';
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
      config={{
        rowEvents: {
          onClick: {
            // Only enable click for active users
            clickable: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'active',
            event: (e: MouseEvent, row: Person) => {
              console.log('Row clicked:', row.first_name, row.last_name);
              alert(`Clicked on ${row.first_name} ${row.last_name} (${row.employment.title})`);
            },
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
      config={{
        rowEvents: {
          onDoubleClick: {
            // Enable double click for all users
            clickable: true,
            event: (e: MouseEvent, row: Person) => {
              console.log('Row double-clicked:', row.first_name, row.last_name);
              alert(
                `Double-clicked on ${row.first_name} ${row.last_name}\nID: ${row.id}\nStatus: ${row.subscription.status}`
              );
            },
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
      config={{
        rowEvents: {
          onDrop: {
            droppable: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'idle',
            event: (e: DragEvent, rowData: Person) => {
              console.log(`Row dropped! Employee: ${rowData.first_name} ${rowData.last_name}`);
              alert(`Dropped employee: ${rowData.first_name} ${rowData.last_name}`);
            },
          },
          onDragStart: {
            draggable: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'active',
            event: (e: DragEvent, rowData: Person) => {
              console.log(`Row dragged! Employee: ${rowData.first_name} ${rowData.last_name}`);
            },
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
      config={{
        rowEvents: {
          onDrop: {
            droppable: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'idle',
            event: (e: DragEvent, rowData: Person) => {
              console.log(`Row dropped! Employee: ${rowData.first_name} ${rowData.last_name}`);
              alert(`Dropped employee: ${rowData.first_name} ${rowData.last_name}`);
            },
          },
          onDragStart: {
            icon: <EditIcon />,
            draggable: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'active',
            event: (e: DragEvent, rowData: Person) => {
              console.log(`Row dragged! Employee: ${rowData.first_name} ${rowData.last_name}`);
            },
          },
        },
      }}
    />
  ),
};
