//error boundary
import { ErrorBoundary } from 'react-error-boundary';
//error boundary fallback
import ErrorBoundaryFallback from '@/components/errorBoundaryFallback/ErrorBoundaryFallback';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { BackendParams, fakeBackend, Person } from './constants/FakeBackend';
import { getMyTeamsDatatableConfig } from './constants/MyTeamsDatatableConfig';
import Datatable from '@/components/shared/datatable/Datatable';
import { DatatableRef, TitleLocationType } from '@/components/shared/datatable/Datatable.types';
import Button from '@/components/shared/button/Button';
import CustomPagination from '@/components/customPagination/CustomPagination';
import usePagination from '@/hooks/usePagination';
import { TitlePositionType } from '@/components/shared/datatable/datatableTitle/DatatableTitle.types';
import cloneDeep from 'lodash/cloneDeep';
import { ColumnOrderType } from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import FilterIcon from '@/assets/icons/FilterIcon';
import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import LoadingIcon from '@/components/shared/LoadingIcon';

export const LocalControlWithoutPaginationExample = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]),
    [localError, setLocalError] = useState(false),
    [isLocalLoading, setIsLocalLoading] = useState(false),
    localConfig = getMyTeamsDatatableConfig(localPeople),
    codeSnippet = `
&lt;Datatable
  title={{
    titleLabel: "Employees",
    titleLocation: "searchRow"
  }}
  columns={localConfig.teamsColumns}
  records={localConfig.teamsRecords}
  config={{
    pagination: {
      enablePagination: false
    },
    rowEvents: localConfig.teamsRowEvents
  }}
  isLoading={isLocalLoading}
  actions={localConfig.teamsActions}
/&gt;
`.trim();

  useEffect(() => {
    (async () => {
      setIsLocalLoading(true);
      try {
        const localData = await fakeBackend({ itemsPerPage: 30 });

        setLocalPeople(localData.data);
      } catch (err) {
        console.log(err);
        setLocalError(true);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {localError && <span>Local error: {localError}</span>}
      <Datatable
        title={{
          titleLabel: 'Employees',
          titleLocation: 'searchRow',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        config={{
          ui: { actionsColWidth: 40 },
          pagination: {
            enablePagination: false,
          },
          rowEvents: localConfig.teamsRowEvents,
        }}
        isLoading={isLocalLoading}
        actions={localConfig.teamsActions}
      />
      <details>
        <summary>Code:</summary>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: codeSnippet }} />
        </pre>
      </details>
    </>
  );
};

const customOptionsList = [
  { value: 5, displayValue: '5 rows' },
  { value: 10, displayValue: '10 rows' },
  { value: 20, displayValue: '20 rows' },
];

export const LocalControlWithPaginationExample = () => {
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([
      {
        id: 25,
        first_name: 'Benjamin',
        last_name: 'Lee',
        employment: { title: 'Data Analyst' },
        subscription: { status: 'active' },
      },
    ]),
    [localPeople, setLocalPeople] = useState<Person[]>([]),
    [localError, setLocalError] = useState(false),
    [isLocalLoading, setIsLocalLoading] = useState(false),
    localConfig = getMyTeamsDatatableConfig(localPeople),
    localDatatableRef = useRef<DatatableRef>(null),
    codeSnippet = `
&lt;Datatable
  ref={localDatatableRef}
  title={{
    titleLabel: "Employees",
    titleLocation: "searchRow",
    titlePosition: "end"
  }}
  config={{
    selection: {
      mode: "checkbox",
      //it can be boolean =&gt; disabled: true
      disabled: (rowData: any) =&gt; rowData.subscription.status.toLowerCase() === "blocked",
      //it can be boolean =&gt; hidden: true
      hidden: (rowData: any) =&gt; rowData.subscription.status.toLowerCase() === "idle",
      onSelectionChange: (selectionsArr: any) =&gt; {
        setSelectedPersons(selectionsArr);
      },
      dataKey: "id",
      className: "custom-input-className",
      selectedData: selectedPersons
    }
  }}
  columns={localConfig.teamsColumns}
  records={localConfig.teamsRecords}
  isLoading={isLocalLoading}
  actions={localConfig.teamsActions}
/&gt;
`.trim();

  useEffect(() => {
    (async () => {
      setIsLocalLoading(true);
      try {
        const localData = await fakeBackend({ itemsPerPage: 30 });

        setLocalPeople(localData.data);
      } catch (err) {
        console.log(err);
        setLocalError(true);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  const resetLocalDatatablePagination = () => {
    if (localDatatableRef.current) {
      const paginationData = localDatatableRef.current.resetPagination();
      console.log({ paginationData });
    }
  };

  return (
    <>
      {localError && <span>Local error: {localError}</span>}
      <Button label="Reset local datatable pagination" onClick={resetLocalDatatablePagination} />
      <p>Selected persons IDs: {selectedPersons.map((el) => el.id).join(', ')}</p>
      <Datatable
        ref={localDatatableRef}
        title={{
          titleLabel: 'Employees',
          titleLocation: 'searchRow',
          titlePosition: 'end',
        }}
        config={{
          ui: {
            actionsColWidth: 40,
          },
          selection: {
            mode: 'checkbox',
            //it can be boolean => disabled: true
            disabled: (rowData: any) => rowData.subscription.status.toLowerCase() === 'blocked',
            //it can be boolean => hidden: true
            hidden: (rowData: any) => rowData.subscription.status.toLowerCase() === 'idle',
            onSelectionChange: (selectionsArr: any) => {
              setSelectedPersons(selectionsArr);
            },
            dataKey: 'id',
            className: 'custom-input-className',
            selectedData: selectedPersons,
          },
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        isLoading={isLocalLoading}
        actions={localConfig.teamsActions}
      />
      <details>
        <summary>Code:</summary>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: codeSnippet }} />
        </pre>
      </details>
    </>
  );
};

export const CustomNoDataToDisplayExample = () => {
  const localConfig = getMyTeamsDatatableConfig([]),
    codeSnippet = `
&lt;Datatable
  title={{
    titleLabel: "Employees",
    titleLocation: "searchRow",
    titlePosition: "end"
  }}
  columns={localConfig.teamsColumns}
  records={localConfig.teamsRecords}
  actions={localConfig.teamsActions}
  noDataToDisplayMessage={
    &lt;div style={{ padding: "5rem 0", textAlign: "center" }}&gt;
      &lt;span&gt;This is a custom no data to display&lt;/span&gt;
    &lt;/div&gt;
  }
/&gt;
`.trim();

  return (
    <>
      <Datatable
        title={{
          titleLabel: 'Employees',
          titleLocation: 'searchRow',
          titlePosition: 'end',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        actions={localConfig.teamsActions}
        noDataToDisplayMessage={
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <span>This is a custom no data to display</span>
          </div>
        }
      />
      <details>
        <summary>Code:</summary>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: codeSnippet }} />
        </pre>
      </details>
    </>
  );
};

const LocalControlledWithCustomPagination = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]),
    [localError, setLocalError] = useState(false),
    [isLocalLoading, setIsLocalLoading] = useState(false),
    localConfig = getMyTeamsDatatableConfig(localPeople),
    [totalRecords, setTotalRecords] = useState(0),
    paginationData = usePagination({
      contentPerPage: 10,
      count: totalRecords,
    }),
    { firstContentIndex, lastContentIndex, navigateToFirstPage } = paginationData,
    codeSnippet = `
&lt;Datatable
  title={{
    titleLabel: "Employees",
    titleLocation: "searchRow",
    titlePosition: "end"
  }}
  columns={localConfig.teamsColumns}
  records={localConfig.teamsRecords}
  config={{
    search: {
      onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount
    },
    pagination: {
      firstContentIndex,
      lastContentIndex,
      resetPagination: () =&gt; navigateToFirstPage(),
      paginationComponent: &lt;CustomPagination {...paginationData} /&gt;
    }
  }}
  isLoading={isLocalLoading}
  actions={localConfig.teamsActions}
/&gt;
`.trim();

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
        setLocalError(true);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  // Callback function passed to Datatable to update totalRecords based on search results
  const handleUpdateFilteredRecordsCount = useCallback((count: number) => {
    setTotalRecords(count);
  }, []);

  return (
    <>
      {localError && <span>Local error: {localError}</span>}
      <Datatable
        title={{
          titleLabel: 'Employees',
          titleLocation: 'searchRow',
          titlePosition: 'end',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        config={{
          ui: {
            actionsColWidth: 40,
          },
          search: {
            onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount,
          },
          pagination: {
            firstContentIndex,
            lastContentIndex,
            resetPagination: () => navigateToFirstPage(),
            paginationComponent: <CustomPagination {...paginationData} />,
          },
        }}
        isLoading={isLocalLoading}
        actions={localConfig.teamsActions}
      />
      <details>
        <summary>Code:</summary>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: codeSnippet }} />
        </pre>
      </details>
    </>
  );
};

const UiConfigSetup = ({
  titlePosition,
  titlePositionHandler,
  titleLocation,
  titleLocationHandler,
  titleButtonsPosition,
  titleButtonsPositionHandler,
  titleButtonsLocation,
  titleButtonsLocationHandler,
  searchPosition,
  searchPositionHandler,
  showTableHeader,
  showTableHeaderHandler,
  showSearch,
  showSearchHandler,
  isSearchFullWidth,
  isSearchFullWidthHandler,
  isActionsColumnLast,
  isActionsColumnLastHandler,
  searchPlaceholder,
  searchPlaceholderHandler,
  actionsColLabel,
  actionsColLabelHandler,
  paginationRangeSeparatorLabel,
  paginationRangeSeparatorLabelHandler,
  columnVisibilityLocation,
  columnVisibilityLocationHandler,
}: {
  titlePosition: TitlePositionType;
  titlePositionHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  titleLocation: TitleLocationType;
  titleLocationHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  titleButtonsPosition: TitlePositionType;
  titleButtonsPositionHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  titleButtonsLocation: TitleLocationType;
  titleButtonsLocationHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  searchPosition: TitlePositionType;
  searchPositionHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  showTableHeader: string;
  showTableHeaderHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  showSearch: string;
  showSearchHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  isSearchFullWidth: string;
  isSearchFullWidthHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  isActionsColumnLast: string;
  isActionsColumnLastHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  searchPlaceholderHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  actionsColLabel: string;
  actionsColLabelHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  paginationRangeSeparatorLabel: string;
  paginationRangeSeparatorLabelHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  columnVisibilityLocation: string;
  columnVisibilityLocationHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Title position: </p>
      <label>
        <input
          type="radio"
          name="titlePosition"
          value="start"
          checked={titlePosition === 'start'}
          onChange={titlePositionHandler}
        />
        Start
      </label>
      <label>
        <input
          type="radio"
          name="titlePosition"
          value="end"
          checked={titlePosition === 'end'}
          onChange={titlePositionHandler}
        />
        End
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Title location: </p>
      <label>
        <input
          type="radio"
          name="titleLocation"
          value="titleRow"
          checked={titleLocation === 'titleRow'}
          onChange={titleLocationHandler}
        />
        Title row
      </label>
      <label>
        <input
          type="radio"
          name="titleLocation"
          value="searchRow"
          checked={titleLocation === 'searchRow'}
          onChange={titleLocationHandler}
        />
        Search row
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Title buttons position: </p>
      <label>
        <input
          type="radio"
          name="titleButtonsPosition"
          value="start"
          checked={titleButtonsPosition === 'start'}
          onChange={titleButtonsPositionHandler}
        />
        Start
      </label>
      <label>
        <input
          type="radio"
          name="titleButtonsPosition"
          value="end"
          checked={titleButtonsPosition === 'end'}
          onChange={titleButtonsPositionHandler}
        />
        End
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Title buttons location: </p>
      <label>
        <input
          type="radio"
          name="titleButtonsLocation"
          value="titleRow"
          checked={titleButtonsLocation === 'titleRow'}
          onChange={titleButtonsLocationHandler}
        />
        Title row
      </label>
      <label>
        <input
          type="radio"
          name="titleButtonsLocation"
          value="searchRow"
          checked={titleButtonsLocation === 'searchRow'}
          onChange={titleButtonsLocationHandler}
        />
        Search row
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Search position: </p>
      <label>
        <input
          type="radio"
          name="searchPosition"
          value="start"
          checked={searchPosition === 'start'}
          onChange={searchPositionHandler}
        />
        Start
      </label>
      <label>
        <input
          type="radio"
          name="searchPosition"
          value="end"
          checked={searchPosition === 'end'}
          onChange={searchPositionHandler}
        />
        End
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Show table header: </p>
      <label>
        <input
          type="radio"
          name="showTableHeader"
          value="true"
          checked={showTableHeader === 'true'}
          onChange={showTableHeaderHandler}
        />
        True
      </label>
      <label>
        <input
          type="radio"
          name="showTableHeader"
          value="false"
          checked={showTableHeader === 'false'}
          onChange={showTableHeaderHandler}
        />
        False
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Show Search: </p>
      <label>
        <input
          type="radio"
          name="showSearch"
          value="true"
          checked={showSearch === 'true'}
          onChange={showSearchHandler}
        />
        True
      </label>
      <label>
        <input
          type="radio"
          name="showSearch"
          value="false"
          checked={showSearch === 'false'}
          onChange={showSearchHandler}
        />
        False
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Is search full width: </p>
      <label>
        <input
          type="radio"
          name="isSearchFullWidth"
          value="true"
          checked={isSearchFullWidth === 'true'}
          onChange={isSearchFullWidthHandler}
        />
        True
      </label>
      <label>
        <input
          type="radio"
          name="isSearchFullWidth"
          value="false"
          checked={isSearchFullWidth === 'false'}
          onChange={isSearchFullWidthHandler}
        />
        False
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Is actions column last: </p>
      <label>
        <input
          type="radio"
          name="isActionsColumnLast"
          value="true"
          checked={isActionsColumnLast === 'true'}
          onChange={isActionsColumnLastHandler}
        />
        True
      </label>
      <label>
        <input
          type="radio"
          name="isActionsColumnLast"
          value="false"
          checked={isActionsColumnLast === 'false'}
          onChange={isActionsColumnLastHandler}
        />
        False
      </label>
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Search placeholder: </p>
      <input type="text" onChange={searchPlaceholderHandler} value={searchPlaceholder} />
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Actions column label: </p>
      <input type="text" onChange={actionsColLabelHandler} value={actionsColLabel} />
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Pagination range separator label: </p>
      <input
        type="text"
        onChange={paginationRangeSeparatorLabelHandler}
        value={paginationRangeSeparatorLabel}
      />
    </div>
    <div className="demo-config-wrapper">
      <p className="demo-config-title">Column visibility location: </p>
      <label>
        <input
          type="radio"
          name="columnVisibilityLocation"
          value="titleRow"
          checked={columnVisibilityLocation === 'titleRow'}
          onChange={columnVisibilityLocationHandler}
        />
        Title row
      </label>
      <label>
        <input
          type="radio"
          name="columnVisibilityLocation"
          value="searchRow"
          checked={columnVisibilityLocation === 'searchRow'}
          onChange={columnVisibilityLocationHandler}
        />
        Search row
      </label>
      <label>
        <input
          type="radio"
          name="columnVisibilityLocation"
          value="actionsColumn"
          checked={columnVisibilityLocation === 'actionsColumn'}
          onChange={columnVisibilityLocationHandler}
        />
        Actions column
      </label>
    </div>
  </div>
);

export const RemoteControlWithPaginationExample = () => {
  const [titleLocation, setTitleLocation] = useState<TitleLocationType>('titleRow'),
    [titlePosition, setTitlePosition] = useState<TitlePositionType>('start'),
    [titleButtonsLocation, setTitleButtonsLocation] = useState<TitleLocationType>('titleRow'),
    [titleButtonsPosition, setTitleButtonsPosition] = useState<TitlePositionType>('end'),
    [searchPosition, setSearchPosition] = useState<TitlePositionType>('end'),
    [showTableHeader, setShowTableHeader] = useState('true'),
    [showSearch, setShowSearch] = useState('true'),
    [isSearchFullWidth, setIsSearchFullWidth] = useState('false'),
    [isActionsColumnLast, setIsActionsColumnLast] = useState('false'),
    [searchPlaceholder, setSearchPlaceholder] = useState('Search...'),
    [actionsColLabel, setActionsColLabel] = useState(''),
    [paginationRangeSeparatorLabel, setPaginationRangeSeparatorLabel] = useState('of'),
    [columnVisibilityLocation, setColumnVisibilityLocation] = useState('actionsColumn'),
    [selectedPerson, setSelectedPerson] = useState<Person | null>({
      id: 25,
      first_name: 'Benjamin',
      last_name: 'Lee',
      employment: { title: 'Data Analyst' },
      subscription: { status: 'active' },
    }),
    [remotePeople, setRemotePeople] = useState<Person[]>([]),
    [remoteError, setRemoteError] = useState(false),
    [isRemoteLoading, setIsRemoteLoading] = useState(false),
    [remoteTotalRecords, setRemoteTotalRecords] = useState(0),
    [remoteParams, setRemoteParams] = useState<BackendParams>({
      currentPage: 1,
      itemsPerPage: 10,
      sortOrder: 'asc',
      sortField: 'first_name',
      searchTerm: '',
    }),
    remoteDatatableRef = useRef<DatatableRef>(null),
    remoteConfig = getMyTeamsDatatableConfig(remotePeople),
    { teamsColumns, teamsRecords, teamsActions, columnVisibilityConfig } = remoteConfig;
  const codeSnippet = `
&lt;Datatable
  ref={remoteDatatableRef}
  title={{
    titleLabel: 'Employees',
    titleLocation,
    titlePosition,
    titleButtons: [
      { label: 'export', onClick: () =&gt; console.log('export') },
      { label: 'import', onClick: () =&gt; console.log('import') },
    ],
    titleButtonsLocation,
    titleButtonsPosition,
  }}
  columns={teamsColumns}
  records={teamsRecords}
  config={{
    // Column visibility configuration
    columnVisibility: {
      ...columnVisibilityConfig,
      location: columnVisibilityLocation,
    },
    ui: {
      showTableHeader: showTableHeader === 'true',
      tableWrapperClassName: 'title-wrapper-class-name',
      tableClassName: 'title-class-name',
      titleStyles: { color: '#475569' },
      isActionsColumnLast: isActionsColumnLast === 'true',
      actionsColLabel,
      actionsColWidth: 40,
      sortIcon: &lt;FilterIcon /&gt;,
      ascendingSortIcon: &lt;AscendingSortIcon /&gt;,
      descendingSortIcon: &lt;DescendingSortIcon /&gt;,
      loadingIcon: &lt;LoadingIcon /&gt;,
      paginationRangeSeparatorLabel,
    },
    search: {
      onSearch: onRemoteSearch,
      searchPosition,
      show: showSearch === 'true',
      isFullWidth: isSearchFullWidth === 'true',
      placeholder: searchPlaceholder,
      searchDataTest: 'search-data-test',
    },
    pagination: {
      remoteControl: {
        onPaginationDataUpdate,
        totalRecords: remoteTotalRecords,
      },
      rowsDropdown: {
        optionsList: customOptionsList,
      },
      deepLinking: {
        pageNumKey: 'page',
        pageSizeKey: 'pageSize',
      },
    },
    sort: {
      onSorting: onRemoteSort,
    },
    selection: {
      mode: 'radio',
      disabled: (rowData: any) =&gt;
        rowData.subscription.status.toLowerCase() === 'blocked',
      hidden: (rowData: any) =&gt; rowData.subscription.status.toLowerCase() === 'idle',
      onSelectionChange: (rowData: any) =&gt; {
        setSelectedPerson(rowData);
      },
      dataKey: 'id',
      className: 'custom-input-className',
      selectedData: selectedPerson,
    },
  }}
  isLoading={isRemoteLoading}
  actions={teamsActions}
  dataTest="table-data-test"
/&gt;
`.trim();

  // Uncomment if no deep linking
  /*useEffect(() => {
    (async () => {
      setIsRemoteLoading(true);
      try {
        // Get initial data with default parameters
        const remoteData = await fakeBackend({
          currentPage: 1,
          itemsPerPage: 10,
          sortOrder: 'asc',
          sortField: 'first_name',
          searchTerm: '',
        });

        setRemotePeople(remoteData.data);
        setRemoteTotalRecords(remoteData.total);
      } catch (err) {
        console.log(err);
        setRemoteError(true);
      } finally {
        setIsRemoteLoading(false);
      }
    })();
  }, []);*/

  // Initial data fetch - only runs once on component mount
  // Use URL parameters if they exist, otherwise use defaults
  useEffect(() => {
    (async () => {
      setIsRemoteLoading(true);
      try {
        // Check URL parameters for initial load
        const searchParams = new URLSearchParams(window.location.search);
        const pageFromUrl = searchParams.get('page');
        const pageSizeFromUrl = searchParams.get('pageSize');

        // Use URL params if available, otherwise use defaults
        const initialPage = pageFromUrl ? +pageFromUrl : 1;
        const initialPageSize = pageSizeFromUrl ? +pageSizeFromUrl : 10;

        // Get initial data with URL-aware parameters
        const remoteData = await fakeBackend({
          currentPage: initialPage,
          itemsPerPage: initialPageSize,
          sortOrder: 'asc',
          sortField: 'first_name',
          searchTerm: '',
        });

        setRemotePeople(remoteData.data);
        setRemoteTotalRecords(remoteData.total);

        // Update state to match URL parameters
        const newParams = cloneDeep(remoteParams);
        newParams.currentPage = initialPage;
        newParams.itemsPerPage = initialPageSize;
        setRemoteParams(newParams);
      } catch (err) {
        console.log(err);
        setRemoteError(true);
      } finally {
        setIsRemoteLoading(false);
      }
    })();
    //eslint-disable-next-line
  }, []); // Only run once on mount, now URL-aware

  const fetchRemoteData = async (newParams: Partial<BackendParams> = {}) => {
    setIsRemoteLoading(true);
    try {
      const remoteData = await fakeBackend(newParams);

      setRemotePeople(remoteData.data);
      setRemoteTotalRecords(remoteData.total);
    } catch (err) {
      console.log(err);
      setRemoteError(true);
    } finally {
      setIsRemoteLoading(false);
    }
  };

  const resetRemoteDatatablePagination = () => {
    if (remoteDatatableRef.current) {
      const paginationData = remoteDatatableRef.current.resetPagination();
      // Update local params state to keep it in sync
      // The resetPagination method already handles the API call via deep linking
      const newParams = cloneDeep(remoteParams);
      newParams.currentPage = paginationData.activePage;
      newParams.itemsPerPage = paginationData.rowsPerPageNum;
      setRemoteParams(newParams);
      // Note: No need to call fetchRemoteData here as resetPagination handles it
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
    newParams.itemsPerPage = 10;

    setRemoteParams(newParams);
    await fetchRemoteData(newParams);
  };

  const onRemoteSort = async (accessorKey: string, order: ColumnOrderType) => {
    const newParams = cloneDeep(remoteParams);
    newParams.sortOrder = order;
    newParams.sortField = accessorKey as keyof Person;

    setRemoteParams(newParams);
    await fetchRemoteData(newParams);
  };

  const titlePositionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitlePosition(event.target.value as TitlePositionType);
  };

  const titleLocationHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleLocation(event.target.value as TitleLocationType);
  };

  const titleButtonsPositionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleButtonsPosition(event.target.value as TitlePositionType);
  };

  const titleButtonsLocationHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitleButtonsLocation(event.target.value as TitleLocationType);
  };

  const searchPositionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPosition(event.target.value as TitlePositionType);
  };

  const showTableHeaderHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setShowTableHeader(event.target.value);
  };

  const showSearchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setShowSearch(event.target.value);
  };

  const isSearchFullWidthHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSearchFullWidth(event.target.value);
  };

  const isActionsColumnLastHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setIsActionsColumnLast(event.target.value);
  };

  const searchPlaceholderHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPlaceholder(event.target.value);
  };

  const actionsColLabelHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setActionsColLabel(event.target.value);
  };

  const paginationRangeSeparatorLabelHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPaginationRangeSeparatorLabel(event.target.value);
  };

  const columnVisibilityLocationHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setColumnVisibilityLocation(event.target.value);
  };

  return (
    <>
      {remoteError && <span>Remote error: {remoteError}</span>}
      <UiConfigSetup
        titlePosition={titlePosition}
        titlePositionHandler={titlePositionHandler}
        titleLocation={titleLocation}
        titleLocationHandler={titleLocationHandler}
        titleButtonsPosition={titleButtonsPosition}
        titleButtonsPositionHandler={titleButtonsPositionHandler}
        titleButtonsLocation={titleButtonsLocation}
        titleButtonsLocationHandler={titleButtonsLocationHandler}
        searchPosition={searchPosition}
        searchPositionHandler={searchPositionHandler}
        showTableHeader={showTableHeader}
        showTableHeaderHandler={showTableHeaderHandler}
        showSearch={showSearch}
        showSearchHandler={showSearchHandler}
        isSearchFullWidth={isSearchFullWidth}
        isSearchFullWidthHandler={isSearchFullWidthHandler}
        isActionsColumnLast={isActionsColumnLast}
        isActionsColumnLastHandler={isActionsColumnLastHandler}
        searchPlaceholder={searchPlaceholder}
        searchPlaceholderHandler={searchPlaceholderHandler}
        actionsColLabel={actionsColLabel}
        actionsColLabelHandler={actionsColLabelHandler}
        paginationRangeSeparatorLabel={paginationRangeSeparatorLabel}
        paginationRangeSeparatorLabelHandler={paginationRangeSeparatorLabelHandler}
        columnVisibilityLocation={columnVisibilityLocation}
        columnVisibilityLocationHandler={columnVisibilityLocationHandler}
      />
      <Button
        label="Reset remote datatable pagination"
        onClick={resetRemoteDatatablePagination}
        style={{ marginTop: '1rem' }}
      />
      <p>Selected person ID: {selectedPerson !== null ? selectedPerson.id : ''}</p>
      <Datatable
        ref={remoteDatatableRef}
        title={{
          titleLabel: 'Employees',
          titleLocation,
          titlePosition,
          titleButtons: [
            { label: 'export', onClick: () => console.log('export') },
            { label: 'import', onClick: () => console.log('import') },
          ],
          titleButtonsLocation,
          titleButtonsPosition,
        }}
        columns={teamsColumns}
        records={teamsRecords}
        config={{
          // Column visibility configuration
          columnVisibility: {
            ...columnVisibilityConfig,
            location: columnVisibilityLocation as 'titleRow' | 'searchRow' | 'actionsColumn',
          },
          ui: {
            showTableHeader: showTableHeader === 'true',
            tableWrapperClassName: 'title-wrapper-class-name',
            tableClassName: 'title-class-name',
            titleStyles: { color: '#475569' },
            isActionsColumnLast: isActionsColumnLast === 'true',
            actionsColLabel,
            actionsColWidth: 40,
            sortIcon: <FilterIcon />,
            ascendingSortIcon: <AscendingSortIcon />,
            descendingSortIcon: <DescendingSortIcon />,
            loadingIcon: <LoadingIcon />,
            paginationRangeSeparatorLabel,
          },
          search: {
            onSearch: onRemoteSearch,
            isLocalSearch: false,
            searchPosition,
            show: showSearch === 'true',
            isFullWidth: isSearchFullWidth === 'true',
            placeholder: searchPlaceholder,
            searchDataTest: 'search-data-test',
          },
          pagination: {
            remoteControl: {
              onPaginationDataUpdate,
              totalRecords: remoteTotalRecords,
            },
            rowsDropdown: {
              optionsList: customOptionsList,
            },
            deepLinking: {
              pageNumKey: 'page',
              pageSizeKey: 'pageSize',
            },
          },
          sort: {
            onSorting: onRemoteSort,
            isLocalSort: false,
          },
          selection: {
            mode: 'radio',
            //it can be boolean => disabled: true
            disabled: (rowData) => rowData.subscription.status.toLowerCase() === 'blocked',
            //it can be boolean => hidden: true
            hidden: (rowData) => rowData.subscription.status.toLowerCase() === 'idle',
            onSelectionChange: (rowData) => {
              setSelectedPerson(rowData);
            },
            dataKey: 'id',
            className: 'custom-input-className',
            selectedData: selectedPerson,
          },
        }}
        isLoading={isRemoteLoading}
        actions={teamsActions}
        dataTest="table-data-test"
      />
      <details>
        <summary>Code:</summary>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: codeSnippet }} />
        </pre>
      </details>
    </>
  );
};

const App = () => (
  <ErrorBoundary
    FallbackComponent={ErrorBoundaryFallback}
    onReset={() => {
      //Reset the state of your app so the error doesn't happen again
      console.log('Try again clicked');
    }}
  >
    <div className="container">
      <p style={{ fontSize: 12 }}>
        <span style={{ color: 'red' }}>Important: </span> If your website supports right-to-left
        (RTL) text, ensure that the <strong>dir</strong> attribute is set on the{' '}
        <strong>body</strong> element to display pagination icons correctly. For example:{' '}
        <strong>&lt;body dir="rtl"&gt;</strong> for RTL languages or{' '}
        <strong>&lt;body dir="ltr"&gt;</strong> for LTR languages, depending on the current
        language. direction
      </p>
      <h3 className="demo-title">Remote & pagination</h3>
      <RemoteControlWithPaginationExample />
      <hr style={{ margin: '25px 0' }} />
      <h3 className="demo-title">Local & pagination</h3>
      <LocalControlWithPaginationExample />
      <hr style={{ margin: '25px 0' }} />
      <h3 className="demo-title">Local & custom pagination</h3>
      <LocalControlledWithCustomPagination />
      <hr style={{ margin: '25px 0' }} />
      <h3 className="demo-title">Local & no pagination</h3>
      <LocalControlWithoutPaginationExample />
      <hr style={{ margin: '25px 0' }} />
      <h3 className="demo-title">Custom no data to display</h3>
      <CustomNoDataToDisplayExample />
    </div>
  </ErrorBoundary>
);

export default App;
