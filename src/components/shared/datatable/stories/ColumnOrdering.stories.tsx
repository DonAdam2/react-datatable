import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';

import Datatable from '../Datatable';
import { StandardDatatableComponent } from './Datatable.stories';

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable/ColumnOrdering',
  component: Datatable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

export const BasicColumnOrdering: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Reorderable Columns)',
        titleLocation: 'titleRow',
      }}
      columnOrdering={{}}
    />
  ),
};

export const BasicColumnOrderingDefault: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Default Behavior - enabled: true)',
        titleLocation: 'titleRow',
      }}
      /*columnOrdering={{
        onColumnReorder: (fromIndex, toIndex, newOrder) => {
          console.log('Basic default - Column reordered:', { fromIndex, toIndex, newOrder });
        },
      }}*/
    />
  ),
};

export const ColumnOrderingWithCallback: Story = {
  render: () => {
    const [columnOrder, setColumnOrder] = useState<string[]>([]);

    const handleColumnReorder = (fromIndex: number, toIndex: number, newOrder: string[]) => {
      setColumnOrder(newOrder);
      console.log('Column reordered:', { fromIndex, toIndex, newOrder });
    };

    return (
      <div>
        <StandardDatatableComponent
          title={{
            titleLabel: 'Employees (With Reorder Callback)',
            titleLocation: 'titleRow',
          }}
          columnOrdering={{
            onColumnReorder: handleColumnReorder,
          }}
        />
        {columnOrder.length > 0 && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
            }}
          >
            <strong>Current Column Order:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {columnOrder.map((col, index) => (
                <li key={col}>
                  {index + 1}. {col}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

export const ColumnOrderingWithDefaultOrder: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Custom Default Order)',
        titleLocation: 'titleRow',
      }}
      columnOrdering={{
        defaultColumnOrder: ['employment.title', 'first_name', 'subscription.status'],
      }}
    />
  ),
};

export const ColumnOrderingDisabled: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Ordering Disabled)',
        titleLocation: 'titleRow',
      }}
      columnOrdering={{
        enabled: false,
      }}
    />
  ),
};

export const ColumnOrderingUndefined: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (columnOrdering undefined - should show icons)',
        titleLocation: 'titleRow',
      }}
      // columnOrdering={undefined} // This should still show ordering icons due to enableOrdering on columns
    />
  ),
};

export const ColumnOrderingPerColumn: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Per-Column Ordering Control)',
        titleLocation: 'titleRow',
      }}
      columnOrdering={{}}
    />
  ),
};
