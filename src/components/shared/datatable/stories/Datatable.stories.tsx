import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode, useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import Datatable from '../Datatable';
import { BackendParams, fakeBackend, Person } from '@/constants/FakeBackend';
import { getMyTeamsDatatableConfig } from '@/constants/MyTeamsDatatableConfig';
import Button from '@/components/shared/button/Button';
import FilterIcon from '@/assets/icons/FilterIcon';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import { DatatableColumnVisibilityConfigInterface } from '@/components/shared/datatable/Datatable.types';

// Helper component for stories that need to load data
interface StandardDatatableComponentProps {
  title: {
    titleLabel: string;
    titlePosition?: 'start' | 'end';
    titleLocation?: 'titleRow' | 'searchRow';
    titleButtons?: Array<{ label: string; onClick: () => void }>;
    titleButtonsPosition?: 'start' | 'end';
    titleButtonsLocation?: 'titleRow' | 'searchRow';
  };
  config?: Record<string, unknown>;
  actions?: boolean;
  noDataToDisplayMessage?: ReactNode;
  columnVisibility?: DatatableColumnVisibilityConfigInterface;
  search?: Record<string, unknown>;
  sort?: Record<string, unknown>;
  pagination?: Record<string, unknown>;
}

export const StandardDatatableComponent = ({
  title,
  config = {},
  actions = true,
  noDataToDisplayMessage,
  columnVisibility,
  search,
  sort,
  pagination,
}: StandardDatatableComponentProps) => {
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
    <Datatable
      title={title}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={actions ? localConfig.teamsActions : undefined}
      columnVisibility={columnVisibility}
      search={search}
      sort={sort}
      pagination={pagination}
      config={{
        ui: { actionsColWidth: 40 },
        ...config,
      }}
      isLoading={isLocalLoading}
      noDataToDisplayMessage={noDataToDisplayMessage}
    />
  );
};

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable',
  component: Datatable,
  excludeStories: ['StandardDatatableComponent'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;
type Story = StoryObj<typeof Datatable>;

// Local Datatable with full functionality
const LocalDatatableComponent = () => {
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
    <Datatable
      title={{
        titleLabel: 'Local Employees',
        titleLocation: 'titleRow',
      }}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={localConfig.teamsActions}
      config={{
        ui: { actionsColWidth: 40 },
      }}
      isLoading={isLocalLoading}
    />
  );
};

export const LocalDatatable: Story = {
  render: () => <LocalDatatableComponent />,
};

// Remote Datatable with server-side operations
const RemoteDatatableComponent = () => {
  const [remotePeople, setRemotePeople] = useState<Person[]>([]);
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const [remoteTotalRecords, setRemoteTotalRecords] = useState(0);
  const [remoteParams, setRemoteParams] = useState<BackendParams>({
    currentPage: 1,
    itemsPerPage: 10,
    sortOrder: 'asc',
    sortField: 'first_name',
    searchTerm: '',
  });

  const remoteConfig = getMyTeamsDatatableConfig(remotePeople);

  useEffect(() => {
    (async () => {
      setIsRemoteLoading(true);
      try {
        const remoteData = await fakeBackend({ itemsPerPage: 10 });
        setRemotePeople(remoteData.data);
        setRemoteTotalRecords(remoteData.total);
      } catch (err) {
        console.log(err);
      } finally {
        setIsRemoteLoading(false);
      }
    })();
  }, []);

  const fetchRemoteData = async (newParams: Partial<BackendParams> = {}) => {
    setIsRemoteLoading(true);
    try {
      const remoteData = await fakeBackend(newParams);
      setRemotePeople(remoteData.data);
      setRemoteTotalRecords(remoteData.total);
    } catch (err) {
      console.log(err);
    } finally {
      setIsRemoteLoading(false);
    }
  };

  const onPaginationDataUpdate = async (currentPage: number, rowsPerPageNum: number) => {
    if (currentPage !== remoteParams.currentPage || rowsPerPageNum !== remoteParams.itemsPerPage) {
      const newParams = cloneDeep(remoteParams);
      newParams.currentPage = currentPage;
      newParams.itemsPerPage = rowsPerPageNum;
      setRemoteParams(newParams);
      await fetchRemoteData(newParams);
    }
  };

  const onRemoteSearch = async (term: string) => {
    const newParams = cloneDeep(remoteParams);
    newParams.searchTerm = term;
    newParams.currentPage = 1;
    setRemoteParams(newParams);
    await fetchRemoteData(newParams);
  };

  const onRemoteSort = async (accessorKey: string, order: 'asc' | 'desc') => {
    const newParams = cloneDeep(remoteParams);
    newParams.sortOrder = order;
    newParams.sortField = accessorKey as keyof Person;
    setRemoteParams(newParams);
    await fetchRemoteData(newParams);
  };

  return (
    <Datatable
      title={{
        titleLabel: 'Remote Employees',
        titleLocation: 'titleRow',
      }}
      columns={remoteConfig.teamsColumns}
      records={remoteConfig.teamsRecords}
      actions={remoteConfig.teamsActions}
      search={{
        onSearch: onRemoteSearch,
        isLocalSearch: false,
      }}
      sort={{
        onSorting: onRemoteSort,
        isLocalSort: false,
      }}
      config={{
        ui: { actionsColWidth: 40 },
      }}
      pagination={{
        remoteControl: {
          onPaginationDataUpdate,
          totalRecords: remoteTotalRecords,
        },
      }}
      isLoading={isRemoteLoading}
    />
  );
};

export const RemoteDatatable: Story = {
  render: () => <RemoteDatatableComponent />,
};

// Custom No Data Message
const CustomNoDataToDisplayComponent = () => {
  const localConfig = getMyTeamsDatatableConfig([]);
  return (
    <Datatable
      title={{
        titleLabel: 'Empty Dataset',
        titleLocation: 'titleRow',
      }}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={localConfig.teamsActions}
      noDataToDisplayMessage={
        <div style={{ padding: '5rem 0', textAlign: 'center' }}>
          <h3>No employees found</h3>
          <p>This is a custom no data message with custom styling.</p>
          <Button label="Add Employee" onClick={() => alert('Add employee clicked!')} />
        </div>
      }
    />
  );
};

export const CustomNoDataToDisplay: Story = {
  render: () => <CustomNoDataToDisplayComponent />,
};

export const HideTableHeader: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (No Header)',
      }}
      config={{
        ui: {
          showTableHeader: false,
        },
      }}
    />
  ),
};

// Custom Icons Stories
export const WithCustomFilterIcons: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Custom Filter Icons)',
      }}
      config={{
        ui: {
          sortIcon: <FilterIcon />,
          ascendingSortIcon: <AscendingSortIcon />,
          descendingSortIcon: <DescendingSortIcon />,
        },
      }}
    />
  ),
};
