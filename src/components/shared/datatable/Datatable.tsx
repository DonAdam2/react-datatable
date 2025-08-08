import { v4 as uuidv4 } from 'uuid';
import {
  RootDatatableInterface,
  DatatableInterface,
  LocalControlledDatatableInterface,
  RemoteControlledDatatableInterface,
  DatatableRef,
} from './Datatable.types';
import { useEffect, useMemo, useState, useCallback, useImperativeHandle, Ref } from 'react';
import { ColumnOrderType } from './datatableHeader/DatatableHeader.types';
import LoadingIcon from '@/components/shared/LoadingIcon';
import cloneDeep from 'lodash/cloneDeep';
import slice from 'lodash/slice';
import { getNestedValue } from '@/constants/Helpers';
import Paper from '@/components/shared/paper/Paper';
import DatatableTitle from '@/components/shared/datatable/datatableTitle/DatatableTitle';
import DatatableTitleAndSearch from '@/components/shared/datatable/datatableTitleAndSearch/DatatableTitleAndSearch';
import DatatableHeader from '@/components/shared/datatable/datatableHeader/DatatableHeader';
import DatatableBodyRow from '@/components/shared/datatable/datatableBodyRow/DatatableBodyRow';
import DatatableFooter from '@/components/shared/datatable/datatableFooter/DatatableFooter';
import DatatablePagination from '@/components/shared/datatable/datatablePagination/DatatablePagination';
import DatatableColumnVisibility from '@/components/shared/datatable/datatableColumnVisibility/DatatableColumnVisibility';
import usePagination from '@/hooks/usePagination';
import SettingsIcon from '@/assets/icons/SettingsIcon';

// Default rows per page options
const rowsPerPageOptions: { value: string; displayValue: string }[] = [
  { value: '5', displayValue: '5 rows' },
  { value: '10', displayValue: '10 rows' },
  { value: '20', displayValue: '20 rows' },
  { value: '30', displayValue: '30 rows' },
  { value: '40', displayValue: '40 rows' },
];

const RootDatatable = <T extends Record<string, any> = Record<string, unknown>>({
  columns,
  actions,
  records,
  title,
  isLoading,
  dataTest,
  noDataToDisplayMessage,
  columnVisibility,
  search,
  config,
}: RootDatatableInterface<T>) => {
  const uniqueId = uuidv4(),
    [isSelectAllRecords, setIsSelectAllRecords] = useState(false),
    [isDragActive, setIsDragActive] = useState(false),
    [sorting, setSorting] = useState<{ accessorKey: string; order: ColumnOrderType }>({
      accessorKey: '',
      order: 'asc',
    }),
    [searchQuery, setSearchQuery] = useState(''),
    [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({}),
    {
      titleLabel,
      titlePosition,
      titleLocation = 'titleRow',
      titleButtons,
      titleButtonsPosition,
      titleButtonsLocation = 'titleRow',
    } = title ?? {},
    {
      showTableHeader = true,
      tableWrapperClassName = '',
      tableClassName = '',
      titleStyles,
      actionsColLabel = '',
      isActionsColumnLast,
      actionsColWidth,
      loadingIcon = <LoadingIcon />,
      sortIcon,
      ascendingSortIcon,
      descendingSortIcon,
    } = config?.ui ?? {},
    {
      show = true,
      isLocalSearch = true,
      searchPosition = 'end',
      onUpdateFilteredRecordsCount,
    } = search ?? {},
    { isLocalSort = true, onSorting } = config?.sort ?? {},
    {
      show: showColumnVisibilityToggle = true,
      trigger,
      defaultVisibleColumns,
      hiddenColumns,
      location = 'actionsColumn',
    } = columnVisibility ?? {},
    {
      resetPagination,
      enablePagination,
      paginationComponent,
      firstContentIndex,
      lastContentIndex,
    } = config?.pagination ?? {},
    isTitleLocationOnTitleRow = titleLocation === 'titleRow',
    isTitleButtonsLocationOnTitleRow = titleButtonsLocation === 'titleRow',
    isTitleLocationOnSearchRow = titleLocation === 'searchRow',
    isTitleButtonsLocationOnSearchRow = titleButtonsLocation === 'searchRow',
    candidateRecordsToSelectAll = useMemo(
      () =>
        showTableHeader && config?.selection !== undefined && config?.selection.mode === 'checkbox'
          ? records.filter((record) => {
              // Create rowInfo object for functions that need it
              const rowInfo = {
                original: record,
                getValue: (key: string) => getNestedValue({ key, obj: record }),
              };

              // Check if the record should be hidden
              const isHidden =
                typeof config.selection?.hidden === 'boolean'
                  ? config.selection?.hidden
                  : config.selection?.hidden?.(rowInfo);

              // Check if the record should be disabled
              const isDisabled =
                typeof config.selection?.disabled === 'boolean'
                  ? config.selection?.disabled
                  : config.selection?.disabled?.(rowInfo);

              // Include record only if it's not hidden and not disabled
              return !isHidden && !isDisabled;
            })
          : [],
      [showTableHeader, records, config?.selection]
    );

  // Initialize column visibility state
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};

    columns.forEach((column) => {
      const columnKey = String(column.accessorKey);

      // If column does not have hiding enabled, it should always be visible
      if (column.enableHiding === false) {
        initialVisibility[columnKey] = true;
      }
      // Only apply defaultVisibleColumns/hiddenColumns logic to columns with hiding enabled
      else {
        // If defaultVisibleColumns is provided, use it
        if (defaultVisibleColumns) {
          initialVisibility[columnKey] = defaultVisibleColumns.includes(columnKey);
        }
        // If hiddenColumns is provided, use it
        else if (hiddenColumns) {
          initialVisibility[columnKey] = !hiddenColumns.includes(columnKey);
        }
        // Otherwise, all columns are visible by default
        else {
          initialVisibility[columnKey] = true;
        }
      }
    });

    setVisibleColumns(initialVisibility);
  }, [columns, defaultVisibleColumns, hiddenColumns]);

  // Filter visible columns
  const visibleColumnsData = useMemo(() => {
    return columns.filter((column) => {
      const columnKey = String(column.accessorKey);
      return visibleColumns[columnKey] !== false;
    });
  }, [columns, visibleColumns]);

  // Handle column visibility toggle
  const handleToggleColumn = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  }, []);

  const recordsData = useMemo(() => {
    let clonedRecords = cloneDeep(records);

    //sorting functionality
    if (isLocalSort && sorting.accessorKey) {
      const reversed = sorting.order === 'asc' ? 1 : -1;
      clonedRecords = clonedRecords.sort((a, b) => {
        const valueA = getNestedValue({ key: sorting.accessorKey, obj: a });
        const valueB = getNestedValue({ key: sorting.accessorKey, obj: b });

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          // Numeric comparison
          return reversed * (valueA - valueB);
        } else {
          // String comparison
          return (
            reversed *
            valueA?.toString().toLowerCase().localeCompare(valueB?.toString().toLowerCase())
          );
        }
      });
    }

    //local search functionality
    if (searchQuery && show && isLocalSearch) {
      clonedRecords = clonedRecords.filter((record) =>
        visibleColumnsData.some((col) =>
          getNestedValue({ key: String(col.accessorKey), obj: record })
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toString().toLowerCase())
        )
      );
    }

    //local pagination functionality
    if (firstContentIndex !== undefined && lastContentIndex !== undefined) {
      clonedRecords = slice(clonedRecords, firstContentIndex, lastContentIndex);
    }

    return clonedRecords;
  }, [
    records,
    visibleColumnsData,
    isLocalSort,
    sorting,
    searchQuery,
    firstContentIndex,
    lastContentIndex,
    show,
    isLocalSearch,
  ]);

  /**
   * This useEffect function updates the total number of rows based on the search term,
   * ensuring the displayed row count accurately reflects the search results.
   */
  useEffect(() => {
    if (paginationComponent !== undefined && show && isLocalSearch && searchQuery !== '') {
      // Invoke callback to update the filtered records count
      onUpdateFilteredRecordsCount?.(recordsData.length);
    }
  }, [
    paginationComponent,
    show,
    isLocalSearch,
    searchQuery,
    recordsData.length,
    onUpdateFilteredRecordsCount,
  ]);

  const sortHandler = async (accessorKey: string, order: ColumnOrderType) => {
    await onSorting?.(accessorKey, order);
    if (isLocalSort) {
      setSorting({ accessorKey, order });
    }
  };

  // Determine where to show the column visibility toggle based on location
  const showColumnVisibilityInTitleRow = location === 'titleRow';
  const showColumnVisibilityInActionsColumn = location === 'actionsColumn';
  const showColumnVisibilityInSearchRow = location === 'searchRow';

  // Column visibility toggle element
  const columnVisibilityToggle =
    showColumnVisibilityToggle && columnVisibility ? (
      <DatatableColumnVisibility
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        trigger={{
          ...trigger,
          icon:
            showColumnVisibilityInActionsColumn && !trigger?.icon ? (
              <SettingsIcon />
            ) : (
              trigger?.icon
            ),
          label: showColumnVisibilityInActionsColumn && !trigger?.label ? '' : trigger?.label,
          variant:
            showColumnVisibilityInActionsColumn && !trigger?.variant ? 'light' : trigger?.variant,
          className:
            showColumnVisibilityInActionsColumn && !trigger?.className
              ? 'actions-col-visibility-button'
              : trigger?.className,
        }}
      />
    ) : null;

  return (
    <Paper className={tableWrapperClassName} dataTest={dataTest}>
      {(isTitleLocationOnTitleRow ||
        isTitleButtonsLocationOnTitleRow ||
        (showColumnVisibilityInTitleRow && columnVisibilityToggle)) && (
        <DatatableTitle
          title={isTitleLocationOnTitleRow ? titleLabel : undefined}
          titleStyles={isTitleLocationOnTitleRow ? titleStyles : undefined}
          titlePosition={isTitleLocationOnTitleRow ? titlePosition : undefined}
          buttons={isTitleButtonsLocationOnTitleRow ? titleButtons : undefined}
          buttonsPosition={isTitleButtonsLocationOnTitleRow ? titleButtonsPosition : undefined}
          columnVisibilityToggle={
            showColumnVisibilityInTitleRow ? columnVisibilityToggle : undefined
          }
        />
      )}
      {(isTitleLocationOnSearchRow ||
        isTitleButtonsLocationOnSearchRow ||
        show ||
        (showColumnVisibilityInSearchRow && columnVisibilityToggle)) && (
        <DatatableTitleAndSearch
          title={isTitleLocationOnSearchRow ? titleLabel : undefined}
          titleStyles={isTitleLocationOnSearchRow ? titleStyles : undefined}
          titlePosition={isTitleLocationOnSearchRow ? titlePosition : undefined}
          buttons={isTitleButtonsLocationOnSearchRow ? titleButtons : undefined}
          buttonsPosition={isTitleButtonsLocationOnSearchRow ? titleButtonsPosition : undefined}
          columnVisibilityToggle={
            showColumnVisibilityInSearchRow ? columnVisibilityToggle : undefined
          }
          search={{
            ...search,
            onSearch: async (value) => {
              if (value === '') {
                onUpdateFilteredRecordsCount?.(records.length);
              }
              setSearchQuery(value);
              resetPagination?.();
              await search?.onSearch?.(value);
            },
            show,
            isLocalSearch,
            isSearchDisabled: isLoading,
            searchPosition,
            isMarginInlineStart:
              searchPosition !== 'start' &&
              ((isTitleLocationOnSearchRow && title !== undefined) ||
                (isTitleButtonsLocationOnSearchRow && titleButtons !== undefined)),
            isMarginInlineEnd:
              searchPosition !== 'end' &&
              ((isTitleLocationOnSearchRow && title !== undefined) ||
                (isTitleButtonsLocationOnSearchRow && titleButtons !== undefined)),
          }}
        />
      )}
      <div className="table-wrapper">
        {isLoading && <div className="center-loader-wrapper">{loadingIcon}</div>}
        <table className={`table ${tableClassName} ${isDragActive ? 'drag-active' : ''}`}>
          {showTableHeader && (
            <DatatableHeader
              columns={visibleColumnsData}
              actions={actions}
              onSorting={sortHandler}
              sortIcon={sortIcon}
              ascendingSortIcon={ascendingSortIcon}
              descendingSortIcon={descendingSortIcon}
              actionsColLabel={actionsColLabel}
              isActionsColumnLast={isActionsColumnLast}
              actionsColWidth={actionsColWidth}
              selection={config?.selection}
              uniqueId={uniqueId}
              isSelectAllRecords={isSelectAllRecords}
              setIsSelectAllRecords={setIsSelectAllRecords}
              candidateRecordsToSelectAll={candidateRecordsToSelectAll}
              columnVisibilityToggle={
                showColumnVisibilityInActionsColumn ? columnVisibilityToggle : undefined
              }
            />
          )}
          <tbody>
            {recordsData.map((row, i) => (
              <DatatableBodyRow
                key={i}
                row={row}
                columns={visibleColumnsData}
                actions={actions}
                actionsColLabel={actionsColLabel}
                isActionsColumnLast={isActionsColumnLast}
                actionsColWidth={actionsColWidth}
                selection={config?.selection}
                uniqueId={uniqueId}
                isSelectAllRecords={isSelectAllRecords}
                setIsSelectAllRecords={setIsSelectAllRecords}
                candidateRecordsToSelectAll={candidateRecordsToSelectAll}
                rowEvents={{
                  ...config?.rowEvents,
                  onDragStart: config?.rowEvents?.onDragStart
                    ? {
                        ...config.rowEvents.onDragStart,
                        event: (e, rowData) => {
                          setIsDragActive(true);
                          config.rowEvents?.onDragStart?.event(e, rowData);
                        },
                      }
                    : undefined,
                  onDrop: config?.rowEvents?.onDrop
                    ? {
                        ...config.rowEvents.onDrop,
                        event: (e, rowData) => {
                          setIsDragActive(false);
                          config.rowEvents?.onDrop?.event(e, rowData);
                        },
                      }
                    : undefined,
                }}
                columnVisibilityToggle={
                  showColumnVisibilityInActionsColumn ? columnVisibilityToggle : undefined
                }
                onDragEnd={() => setIsDragActive(false)}
              />
            ))}
          </tbody>
        </table>
        {recordsData.length === 0 && (
          <>
            {noDataToDisplayMessage ? (
              noDataToDisplayMessage
            ) : (
              <p className="no-data">No data to display</p>
            )}
          </>
        )}
      </div>
      {enablePagination && paginationComponent}
    </Paper>
  );
};

// Unified controlled datatable component
const ControlledDatatable = <T extends Record<string, any> = Record<string, unknown>>({
  config,
  search,
  ref,
  ...rest
}: (LocalControlledDatatableInterface<T> | RemoteControlledDatatableInterface<T>) & {
  ref?: Ref<DatatableRef>;
}) => {
  const { rowsDropdown, enablePagination = true, deepLinking } = config?.pagination ?? {};
  const { rowsPerPage = 10, enableRowsDropdown = true, optionsList } = rowsDropdown ?? {};
  const { isLocalSearch = true, ...otherSearchProps } = search ?? {};
  const { isLocalSort = true, onSorting } = config?.sort ?? {};

  // Safe access to remoteControl properties
  const remoteControl = (config?.pagination as any)?.remoteControl;
  const { onPaginationDataUpdate, totalRecords: remoteTotalRecords = 0 } = remoteControl ?? {};

  const [localTotalRecords, setLocalTotalRecords] = useState(0);

  // Determine if we're using remote pagination
  const isRemotePagination = !!remoteControl;
  const totalRecords = isRemotePagination ? remoteTotalRecords : localTotalRecords;

  const paginationData = usePagination({
    contentPerPage: rowsPerPage,
    count: totalRecords,
    fetchData: onPaginationDataUpdate
      ? async (page, perPage) => {
          await onPaginationDataUpdate(page, perPage);
        }
      : undefined,
    deepLinking,
  });

  const {
    activePage,
    navigateToPrevPage,
    navigateToNextPage,
    navigateToFirstPage,
    navigateToLastPage,
    navigateToPage,
    updateCurrentRowsPerPage,
    firstContentIndex,
    lastContentIndex,
    totalPages,
    contentPerPage,
  } = paginationData;

  const modifiedOptionsList = useMemo(
    () =>
      optionsList
        ? optionsList.map((el) => ({ ...el, value: JSON.stringify(el.value) }))
        : rowsPerPageOptions,
    [optionsList]
  );

  // Update local total records for local pagination
  useEffect(() => {
    if (!isRemotePagination) {
      setLocalTotalRecords(rest.records.length);
    }
  }, [rest.records.length, isRemotePagination]);

  const onChangeRowsPerPage = async (value: string | string[]) => {
    const newRowsPerPage = +value;
    await updateCurrentRowsPerPage(newRowsPerPage);
  };

  const resetPagination = useCallback(() => {
    if (activePage !== 1 || contentPerPage !== rowsPerPage) {
      (async () => {
        await navigateToPage(1, rowsPerPage);
      })();
    }

    return {
      activePage: 1,
      rowsPerPageNum: rowsPerPage,
    };
  }, [rowsPerPage, activePage, contentPerPage, navigateToPage]);

  useImperativeHandle(
    ref,
    () => ({
      resetPagination,
    }),
    [resetPagination]
  );

  // Callback function for local pagination with local search to update totalRecords based on search results
  const handleUpdateFilteredRecordsCount = useCallback(
    (count: number) => {
      if (!isRemotePagination) {
        setLocalTotalRecords(count);
      }
    },
    [isRemotePagination]
  );

  return (
    <RootDatatable
      {...rest}
      search={{
        ...otherSearchProps,
        isLocalSearch,
        // Only provide the callback for local pagination with local search
        onUpdateFilteredRecordsCount:
          !isRemotePagination && isLocalSearch ? handleUpdateFilteredRecordsCount : undefined,
      }}
      config={{
        ...config,
        sort: {
          isLocalSort,
          onSorting,
        },
        pagination: {
          enablePagination,
          // Only provide content indices for local pagination (for data slicing)
          firstContentIndex: !isRemotePagination ? firstContentIndex : undefined,
          lastContentIndex: !isRemotePagination ? lastContentIndex : undefined,
          resetPagination: enablePagination ? resetPagination : undefined,
          paginationComponent: enablePagination ? (
            <DatatableFooter
              paginationComponent={
                <DatatablePagination
                  navigateToFirstPage={navigateToFirstPage}
                  navigateToLastPage={navigateToLastPage}
                  navigateToPrevPage={navigateToPrevPage}
                  navigateToNextPage={navigateToNextPage}
                  totalPages={totalPages}
                  totalRecords={totalRecords}
                  recordsPerPage={contentPerPage}
                  activePage={activePage}
                  paginationRangeSeparatorLabel={config?.ui?.paginationRangeSeparatorLabel}
                />
              }
              enableRowsDropdown={enableRowsDropdown}
              rowsPerPageOptions={modifiedOptionsList}
              rowsPerPageNum={String(contentPerPage)}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          ) : undefined,
        },
      }}
    />
  );
};

const Datatable = <T extends Record<string, any> = Record<string, unknown>>({
  config,
  ref,
  ...rest
}: DatatableInterface<T> & {
  ref?: Ref<DatatableRef>;
}) => {
  const paginationConfig = { enablePagination: true, ...config?.pagination };
  const enhancedConfig = { ...config, pagination: paginationConfig };

  // Type guard to determine if custom pagination component is provided
  const isCustomPagination = !!(paginationConfig as any)?.paginationComponent;

  return (
    <>
      {enhancedConfig.pagination.enablePagination ? (
        isCustomPagination ? (
          <RootDatatable {...rest} config={enhancedConfig as any} />
        ) : (
          <ControlledDatatable {...rest} config={enhancedConfig as any} ref={ref} />
        )
      ) : (
        <RootDatatable {...rest} config={enhancedConfig as any} />
      )}
    </>
  );
};

export default Datatable;
