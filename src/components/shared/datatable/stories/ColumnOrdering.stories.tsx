import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useState } from 'react';

import Datatable from '../Datatable';
import { StandardDatatableComponent } from './Datatable.stories';
import { fakeBackend, Person } from '@/constants/FakeBackend';
import { getMyTeamsDatatableConfig } from '@/constants/MyTeamsDatatableConfig';

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

// Two datatables on the same page, each persists its own column order via localStorage (UUID per table = no conflicts)
const PersistOrderTwoDatatablesComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const config = getMyTeamsDatatableConfig(localPeople);

  useEffect(() => {
    (async () => {
      setIsLocalLoading(true);
      try {
        const localData = await fakeBackend({ itemsPerPage: 20 });
        setLocalPeople(localData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <p style={{ margin: 0, color: '#666' }}>
        Drag column headers to reorder. Each table uses <code>persistOrder: &#123; enabled, key &#125;</code> so
        order is saved in localStorage and survives page refresh. Table 1 and Table 2 use different
        keys so their orders do not conflict.
      </p>
      <Datatable
        title={{
          titleLabel: 'Table 1 – Employees (persistOrder)',
          titleLocation: 'titleRow',
        }}
        columns={config.teamsColumns}
        records={config.teamsRecords}
        actions={config.teamsActions}
        columnOrdering={{
          enabled: true,
          persistOrder: { enabled: true, key: 'persist-order-table-1' },
        }}
        search={{}}
        pagination={{}}
        ui={{ actionsColWidth: 40 }}
        isLoading={isLocalLoading}
      />
      <Datatable
        title={{
          titleLabel: 'Table 2 – Employees (persistOrder)',
          titleLocation: 'titleRow',
        }}
        columns={config.teamsColumns}
        records={config.teamsRecords}
        actions={config.teamsActions}
        columnOrdering={{
          enabled: true,
          persistOrder: { enabled: true, key: 'persist-order-table-2' },
        }}
        search={{}}
        pagination={{}}
        ui={{ actionsColWidth: 40 }}
        isLoading={isLocalLoading}
      />
    </div>
  );
};

export const PersistOrderTwoDatatables: Story = {
  render: () => <PersistOrderTwoDatatablesComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Two datatables with `persistOrder: { enabled: true, key: "..." }`. Column order is stored in localStorage under those keys and survives page refresh. Reorder columns in each table, refresh the page—each table restores its own order without conflict.',
      },
    },
  },
};
