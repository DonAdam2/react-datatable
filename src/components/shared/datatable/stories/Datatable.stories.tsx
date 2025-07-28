import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import Datatable from '../Datatable';
import { BackendParams, fakeBackend, Person } from '@/constants/FakeBackend';
import { getMyTeamsDatatableConfig } from '@/constants/MyTeamsDatatableConfig';
import Button from '@/components/shared/button/Button';
import CustomPagination from '@/components/customPagination/CustomPagination';
import usePagination from '@/hooks/usePagination';
import FilterIcon from '@/assets/icons/FilterIcon';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';

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
}

const StandardDatatableComponent = ({
  title,
  config = {},
  actions = true,
  noDataToDisplayMessage,
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
      config={{
        ui: { actionsColWidth: 40 },
        rowEvents: localConfig.teamsRowEvents,
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
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

// Custom pagination options
const customOptionsList = [
  { value: 5, displayValue: '5 rows' },
  { value: 10, displayValue: '10 rows' },
  { value: 20, displayValue: '20 rows' },
];

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
        rowEvents: localConfig.teamsRowEvents,
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
      config={{
        ui: { actionsColWidth: 40 },
        search: {
          onSearch: onRemoteSearch,
          isLocalSearch: false,
        },
        sort: {
          onSorting: onRemoteSort,
          isLocalSort: false,
        },
        pagination: {
          remoteControl: {
            onPaginationDataUpdate,
            totalRecords: remoteTotalRecords,
          },
        },
        rowEvents: remoteConfig.teamsRowEvents,
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

// Search Position Stories
export const SearchPositionStart: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Search Start)',
      }}
      config={{
        search: {
          searchPosition: 'start',
        },
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
      config={{
        search: {
          searchPosition: 'end',
        },
      }}
    />
  ),
};

// Column Visibility Stories
export const ColumnsVisibilityInTitleRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees with Column Visibility',
        titleLocation: 'titleRow',
      }}
      config={{
        columnVisibility: {
          show: true,
          location: 'titleRow',
          trigger: { label: 'Show/Hide Columns' },
          defaultVisibleColumns: ['employment.title'],
        },
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
      config={{
        columnVisibility: {
          show: true,
          location: 'searchRow',
          trigger: { label: 'Columns' },
          defaultVisibleColumns: ['employment.title'],
        },
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
      config={{
        columnVisibility: {
          show: true,
          location: 'actionsColumn',
          trigger: { label: '' },
          defaultVisibleColumns: ['employment.title'],
        },
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
      config={{
        columnVisibility: {
          show: true,
          location: 'actionsColumn',
          trigger: { label: '' },
          defaultVisibleColumns: ['employment.title'],
        },
      }}
    />
  ),
};

// UI Configuration Stories
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

export const HideTableSearch: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (No Search)',
      }}
      config={{
        search: {
          show: false,
        },
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
      config={{
        search: {
          isFullWidth: true,
        },
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
      config={{
        search: {
          placeholder: 'Type to search employees...',
        },
      }}
    />
  ),
};

export const ActionsColumnPositionLast: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Actions Last)',
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
          actionsColLabel: 'Operations',
        },
      }}
    />
  ),
};

export const PaginationRangeSeparatorLabel: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Custom Separator)',
      }}
      config={{
        ui: {
          paginationRangeSeparatorLabel: 'out of',
        },
      }}
    />
  ),
};

// Deep Linking Stories
export const LocalDeepLinkingPagination: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Deep Linking)',
      }}
      config={{
        pagination: {
          deepLinking: {
            pageNumKey: 'page',
          },
        },
      }}
    />
  ),
};

// Remote Deep Linking Pagination
const RemoteDeepLinkingPaginationComponent = () => {
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

  return (
    <Datatable
      title={{
        titleLabel: 'Remote Employees (Deep Linking)',
      }}
      columns={remoteConfig.teamsColumns}
      records={remoteConfig.teamsRecords}
      actions={remoteConfig.teamsActions}
      config={{
        ui: { actionsColWidth: 40 },
        pagination: {
          deepLinking: {
            pageNumKey: 'page',
          },
          remoteControl: {
            onPaginationDataUpdate,
            totalRecords: remoteTotalRecords,
          },
        },
        rowEvents: remoteConfig.teamsRowEvents,
      }}
      isLoading={isRemoteLoading}
    />
  );
};

export const RemoteDeepLinkingPagination: Story = {
  render: () => <RemoteDeepLinkingPaginationComponent />,
};

// Custom Pagination Component
const CustomPaginationComponentStory = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const localConfig = getMyTeamsDatatableConfig(localPeople);

  const paginationData = usePagination({
    contentPerPage: 10,
    count: totalRecords,
  });

  const { firstContentIndex, lastContentIndex, navigateToFirstPage } = paginationData;

  useEffect(() => {
    setTotalRecords(localPeople.length);
  }, [localPeople.length]);

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

  const handleUpdateFilteredRecordsCount = useCallback((count: number) => {
    setTotalRecords(count);
  }, []);

  return (
    <Datatable
      title={{
        titleLabel: 'Employees (Custom Pagination)',
      }}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={localConfig.teamsActions}
      config={{
        ui: { actionsColWidth: 40 },
        search: {
          onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount,
        },
        pagination: {
          firstContentIndex,
          lastContentIndex,
          resetPagination: () => navigateToFirstPage(),
          paginationComponent: <CustomPagination {...paginationData} />,
        },
        rowEvents: localConfig.teamsRowEvents,
      }}
      isLoading={isLocalLoading}
    />
  );
};

export const CustomPaginationComponent: Story = {
  render: () => <CustomPaginationComponentStory />,
};

// Without Pagination
export const WithoutPagination: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (No Pagination)',
      }}
      config={{
        pagination: {
          enablePagination: false,
        },
      }}
    />
  ),
};

// Selection Stories
const RadioSelectionComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>({
    id: 25,
    first_name: 'Benjamin',
    last_name: 'Lee',
    employment: { title: 'Data Analyst' },
    subscription: { status: 'active' },
  });
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
    <div>
      <p>Selected person ID: {selectedPerson ? selectedPerson.id : 'None'}</p>
      <Datatable
        title={{
          titleLabel: 'Employees (Radio Selection)',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        actions={localConfig.teamsActions}
        config={{
          ui: { actionsColWidth: 40 },
          selection: {
            mode: 'radio',
            disabled: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'blocked',
            hidden: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'idle',
            onSelectionChange: (rowData: Person) => {
              setSelectedPerson(rowData);
            },
            dataKey: 'id',
            selectedData: selectedPerson,
          },
          rowEvents: localConfig.teamsRowEvents,
        }}
        isLoading={isLocalLoading}
      />
    </div>
  );
};

export const RadioSelection: Story = {
  render: () => <RadioSelectionComponent />,
};

const CheckboxSelectionComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([
    {
      id: 25,
      first_name: 'Benjamin',
      last_name: 'Lee',
      employment: { title: 'Data Analyst' },
      subscription: { status: 'active' },
    },
  ]);
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
    <div>
      <p>Selected persons IDs: {selectedPersons.map((el) => el.id).join(', ')}</p>
      <Datatable
        title={{
          titleLabel: 'Employees (Checkbox Selection)',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        actions={localConfig.teamsActions}
        config={{
          ui: { actionsColWidth: 40 },
          selection: {
            mode: 'checkbox',
            disabled: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'blocked',
            hidden: (rowData: Person) => rowData.subscription.status.toLowerCase() === 'idle',
            onSelectionChange: (selectionsArr: Person | Person[]) => {
              setSelectedPersons(selectionsArr as Person[]);
            },
            dataKey: 'id',
            selectedData: selectedPersons,
          },
          rowEvents: localConfig.teamsRowEvents,
        }}
        isLoading={isLocalLoading}
      />
    </div>
  );
};

export const CheckboxSelection: Story = {
  render: () => <CheckboxSelectionComponent />,
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

export const WithCustomVisibilityTriggerInTitleRow: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Custom Visibility Trigger)',
        titleLocation: 'titleRow',
      }}
      config={{
        columnVisibility: {
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
        },
      }}
    />
  ),
};
