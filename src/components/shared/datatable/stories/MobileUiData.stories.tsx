import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useState } from 'react';
import Datatable from '../Datatable';
import { getMyTeamsDatatableConfig } from '@/constants/MyTeamsDatatableConfig';
import { fakeBackend } from '@/constants/FakeBackend';
import { Person } from '@/constants/FakeBackend';
import { MobileUiDataInterface } from '../Datatable.types';
import { getNestedValue } from '@/constants/Helpers';
import Dropdown from '@/components/shared/dropdown/Dropdown';
import DotsIcon from '@/assets/icons/DotsIcon';
import EditIcon from '@/assets/icons/EditIcon';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import TrashIcon from '@/assets/icons/TrashIcon';

const meta: Meta<typeof Datatable<Person>> = {
  title: 'Components/Datatable/Mobile UI Data',
  component: Datatable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'When `mobileUiData` is provided, the datatable renders a compact mobile layout below the breakpoint (default 768px). Resize the viewport or use the viewport toolbar to see the mobile view. Each row shows `column(row, index)` and `action(row, index)` content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Datatable<Person>>;

/** Same actions as desktop: Dropdown (Edit/Delete) when status is idle, TrashIcon otherwise */
function MobileActionCell({ row }: { row: Person }) {
  const getValue = (key: string) => getNestedValue({ key, obj: row });
  const status = getValue('subscription.status')?.toString().toLowerCase() ?? '';
  const isIdle = status === 'idle';
  const isActive = status === 'active';

  if (isIdle) {
    return (
      <Dropdown
        header={{
          trigger: <DotsIcon />,
        }}
        body={{
          options: [
            {
              displayValue: 'Edit',
              leftIcon: <EditIcon />,
              onClickData: {
                onClick: () =>
                  console.log(`Edit: ${getValue('first_name')} ${getValue('last_name')}`),
                data: 'EDIT',
              },
            },
            {
              displayValue: 'Delete',
              leftIcon: <DeleteIcon />,
              onClickData: {
                onClick: () =>
                  console.log(`Delete: ${getValue('first_name')} ${getValue('last_name')}`),
                data: 'DELETE',
              },
            },
          ],
        }}
      />
    );
  }

  return (
    <button
      className="datatable-icon-button"
      disabled={isActive}
      onClick={() => console.log('delete ', `${getValue('first_name')} ${getValue('last_name')}`)}
      type="button"
      aria-label="Delete row"
    >
      <TrashIcon />
    </button>
  );
}

const mobileUiData: MobileUiDataInterface<Person> = {
  column: (row, index) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <strong>
        {row.first_name} {row.last_name}
      </strong>
      <span style={{ fontSize: 12, color: '#666' }}>{row.employment.title}</span>
      <span style={{ fontSize: 11, textTransform: 'uppercase' }}>{row.subscription.status}</span>
    </div>
  ),
  action: (row, index) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <MobileActionCell row={row} />
    </div>
  ),
};

const MobileUiDataComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const localConfig = getMyTeamsDatatableConfig(localPeople);

  useEffect(() => {
    (async () => {
      setIsLocalLoading(true);
      try {
        const localData = await fakeBackend({ itemsPerPage: 30 });
        setLocalPeople(localData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  return (
    <Datatable<Person>
      title={{
        titleLabel: 'Employees (Mobile UI)',
        titleLocation: 'titleRow',
      }}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={localConfig.teamsActions}
      mobileUiData={{ ...mobileUiData, mobileBreakpoint: 768 }}
      ui={{
        actionsColWidth: 40,
      }}
      isLoading={isLocalLoading}
    />
  );
};

export const WithMobileUiData: Story = {
  render: () => <MobileUiDataComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Resize the browser window below 768px to see the mobile layout. The action column shows the same dropdown as desktop (Edit/Delete when status is idle, Trash icon otherwise).',
      },
    },
  },
};

const NoMobileUiDataComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const localConfig = getMyTeamsDatatableConfig(localPeople);

  useEffect(() => {
    (async () => {
      setIsLocalLoading(true);
      try {
        const localData = await fakeBackend({ itemsPerPage: 30 });
        setLocalPeople(localData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  return (
    <Datatable<Person>
      title={{
        titleLabel: 'Employees (No mobileUiData – always table)',
        titleLocation: 'titleRow',
      }}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={localConfig.teamsActions}
      ui={{ actionsColWidth: 40 }}
      isLoading={isLocalLoading}
    />
  );
};

export const WithoutMobileUiData: Story = {
  render: () => <NoMobileUiDataComponent />,
};
