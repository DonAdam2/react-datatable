import { v4 as uuidv4 } from 'uuid';
import {
  RootDatatableInterface,
  DatatableInterface,
  LocalControlledDatatableInterface,
  RemoteControlledDatatableInterface,
} from './Datatable.types';
import { useEffect, useMemo, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
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
import usePagination from '@/hooks/usePagination';

// Default rows per page options
const rowsPerPageOptions: { value: string; displayValue: string }[] = [
  { value: '5', displayValue: '5 rows' },
  { value: '10', displayValue: '10 rows' },
  { value: '20', displayValue: '20 rows' },
  { value: '30', displayValue: '30 rows' },
  { value: '40', displayValue: '40 rows' },
];

const RootDatatable = ({
  columns,
  actions,
  records,
  title,
  isLoading,
  dataTest,
  noDataToDisplayMessage,
  config,
}: RootDatatableInterface) => {
  const uniqueId = uuidv4(),
    [isSelectAllRecords, setIsSelectAllRecords] = useState(false),
    [sorting, setSorting] = useState<{ field: string; order: ColumnOrderType }>({
      field: '',
      order: 'asc',
    }),
    [searchQuery, setSearchQuery] = useState(''),
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
    } = config?.search ?? {},
    { isLocalSort = true, onSorting } = config?.sort ?? {},
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
              // Check if the record should be hidden
              const isHidden =
                typeof config.selection?.hidden === 'boolean'
                  ? config.selection?.hidden
                  : config.selection?.hidden?.(record);

              // Check if the record should be disabled
              const isDisabled =
                typeof config.selection?.disabled === 'boolean'
                  ? config.selection?.disabled
                  : config.selection?.disabled?.(record);

              // Include record only if it's not hidden and not disabled
              return !isHidden && !isDisabled;
            })
          : [],
      [showTableHeader, records, config?.selection]
    );

  const recordsData = useMemo(() => {
    let clonedRecords = cloneDeep(records);

    //sorting functionality
    if (isLocalSort && sorting.field) {
      const reversed = sorting.order === 'asc' ? 1 : -1;
      clonedRecords = clonedRecords.sort((a, b) => {
        const valueA = getNestedValue({ key: sorting.field, obj: a });
        const valueB = getNestedValue({ key: sorting.field, obj: b });

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
        columns.some((col) =>
          getNestedValue({ key: col.field, obj: record })
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
    columns,
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

  const sortHandler = async (field: string, order: ColumnOrderType) => {
    await onSorting?.(field, order);
    if (isLocalSort) {
      setSorting({ field, order });
    }
  };

  return (
    <Paper className={tableWrapperClassName} dataTest={dataTest}>
      {(isTitleLocationOnTitleRow || isTitleButtonsLocationOnTitleRow) && (
        <DatatableTitle
          title={isTitleLocationOnTitleRow ? titleLabel : undefined}
          titleStyles={isTitleLocationOnTitleRow ? titleStyles : undefined}
          titlePosition={isTitleLocationOnTitleRow ? titlePosition : undefined}
          buttons={isTitleButtonsLocationOnTitleRow ? titleButtons : undefined}
          buttonsPosition={isTitleButtonsLocationOnTitleRow ? titleButtonsPosition : undefined}
        />
      )}
      {(isTitleLocationOnSearchRow || isTitleButtonsLocationOnSearchRow || show) && (
        <DatatableTitleAndSearch
          title={isTitleLocationOnSearchRow ? titleLabel : undefined}
          titleStyles={isTitleLocationOnSearchRow ? titleStyles : undefined}
          titlePosition={isTitleLocationOnSearchRow ? titlePosition : undefined}
          buttons={isTitleButtonsLocationOnSearchRow ? titleButtons : undefined}
          buttonsPosition={isTitleButtonsLocationOnSearchRow ? titleButtonsPosition : undefined}
          search={{
            ...config?.search,
            onSearch: async (value) => {
              if (value === '') {
                onUpdateFilteredRecordsCount?.(records.length);
              }
              setSearchQuery(value);
              resetPagination?.();
              await config?.search?.onSearch?.(value);
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
        <table className={`table ${tableClassName}`}>
          {showTableHeader && (
            <DatatableHeader
              columns={columns}
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
            />
          )}
          <tbody>
            {recordsData.map((row, i) => (
              <DatatableBodyRow
                key={i}
                row={row}
                columns={columns}
                actions={actions}
                actionsColLabel={actionsColLabel}
                isActionsColumnLast={isActionsColumnLast}
                actionsColWidth={actionsColWidth}
                selection={config?.selection}
                uniqueId={uniqueId}
                isSelectAllRecords={isSelectAllRecords}
                setIsSelectAllRecords={setIsSelectAllRecords}
                candidateRecordsToSelectAll={candidateRecordsToSelectAll}
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

// Local controlled datatable component
const LocalControlledDatatable = forwardRef<
  { resetPagination: () => { activePage: number; rowsPerPageNum: number } },
  LocalControlledDatatableInterface
>(({ config, ...rest }, ref) => {
  const { rowsDropdown, enablePagination = true, deepLinking } = config?.pagination ?? {};
  const { rowsPerPage = 10, enableRowsDropdown = true, optionsList } = rowsDropdown ?? {};
  const { isLocalSearch = true, ...otherSearchProps } = config?.search ?? {};

  const [rowsPerPageNum, setRowsPerPageNum] = useState(rowsPerPage);
  const [totalRecords, setTotalRecords] = useState(0);

  const paginationData = usePagination({
    contentPerPage: rowsPerPageNum,
    count: totalRecords,
    deepLinking,
  });

  const {
    activePage,
    navigateToPrevPage,
    navigateToNextPage,
    navigateToFirstPage,
    navigateToLastPage,
    updateCurrentRowsPerPage,
    firstContentIndex,
    lastContentIndex,
    totalPages,
  } = paginationData;

  const modifiedOptionsList = useMemo(
    () =>
      optionsList
        ? optionsList.map((el) => ({ ...el, value: JSON.stringify(el.value) }))
        : rowsPerPageOptions,
    [optionsList]
  );

  useEffect(() => {
    setTotalRecords(rest.records.length);
  }, [rest.records.length]);

  const onChangeRowsPerPage = async (value: string | string[]) => {
    const newRowsPerPage = +value;
    setRowsPerPageNum(newRowsPerPage);
    await updateCurrentRowsPerPage(newRowsPerPage);
  };

  const resetPagination = useCallback(() => {
    if (activePage !== 1 || rowsPerPageNum !== rowsPerPage) {
      navigateToFirstPage();
      setRowsPerPageNum(rowsPerPage);
    }

    return {
      activePage: 1,
      rowsPerPageNum: rowsPerPage,
    };
  }, [rowsPerPage, activePage, rowsPerPageNum, navigateToFirstPage]);

  useImperativeHandle(
    ref,
    () => ({
      resetPagination,
    }),
    [resetPagination]
  );

  // Callback function passed to RootDatatable to update totalRecords based on search results
  const handleUpdateFilteredRecordsCount = useCallback((count: number) => {
    setTotalRecords(count);
  }, []);

  return (
    <RootDatatable
      {...rest}
      config={{
        ...config,
        search: {
          ...otherSearchProps,
          isLocalSearch,
          onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount,
        },
        pagination: {
          enablePagination,
          firstContentIndex,
          lastContentIndex,
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
                  recordsPerPage={rowsPerPageNum}
                  activePage={activePage}
                  paginationRangeSeparatorLabel={config?.ui?.paginationRangeSeparatorLabel}
                />
              }
              enableRowsDropdown={enableRowsDropdown}
              rowsPerPageOptions={modifiedOptionsList}
              rowsPerPageNum={JSON.stringify(rowsPerPageNum)}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          ) : undefined,
        },
      }}
    />
  );
});

// Remote controlled datatable component
const RemoteControlledDatatable = forwardRef<
  { resetPagination: () => { activePage: number; rowsPerPageNum: number } },
  RemoteControlledDatatableInterface
>(({ config, ...rest }, ref) => {
  const {
    rowsDropdown,
    remoteControl,
    enablePagination = true,
    deepLinking,
  } = config?.pagination ?? {};
  const { isLocalSearch = false, ...otherSearchProps } = config?.search ?? {};
  const { isLocalSort = false, onSorting } = config?.sort ?? {};
  const { rowsPerPage = 10, enableRowsDropdown = true, optionsList } = rowsDropdown ?? {};
  const { onPaginationDataUpdate, totalRecords = 0 } = remoteControl ?? {};

  const [rowsPerPageNum, setRowsPerPageNum] = useState(rowsPerPage);

  const paginationData = usePagination({
    contentPerPage: rowsPerPageNum,
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
    updateCurrentRowsPerPage,
    navigateToFirstPage,
    navigateToLastPage,
    navigateToPrevPage,
    navigateToNextPage,
    totalPages,
  } = paginationData;

  const modifiedOptionsList = useMemo(
    () =>
      optionsList
        ? optionsList.map((el) => ({ ...el, value: JSON.stringify(el.value) }))
        : rowsPerPageOptions,
    [optionsList]
  );

  const resetPagination = useCallback(() => {
    if (activePage !== 1 || rowsPerPageNum !== rowsPerPage) {
      setRowsPerPageNum(rowsPerPage);
      // Trigger navigation to first page to fetch data (async operation)
      navigateToFirstPage();
    }

    return {
      activePage: 1,
      rowsPerPageNum: rowsPerPage,
    };
  }, [rowsPerPage, activePage, rowsPerPageNum, navigateToFirstPage]);

  useImperativeHandle(
    ref,
    () => ({
      resetPagination,
    }),
    [resetPagination]
  );

  const onChangeRowsPerPage = async (value: string | string[]) => {
    const newRowsPerPage = +value;
    setRowsPerPageNum(newRowsPerPage);
    await updateCurrentRowsPerPage(newRowsPerPage);
  };

  return (
    <RootDatatable
      {...rest}
      config={{
        ...config,
        search: {
          ...otherSearchProps,
          isLocalSearch,
        },
        sort: {
          isLocalSort,
          onSorting,
        },
        pagination: {
          enablePagination,
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
                  recordsPerPage={rowsPerPageNum}
                  activePage={activePage}
                  paginationRangeSeparatorLabel={config?.ui?.paginationRangeSeparatorLabel}
                />
              }
              enableRowsDropdown={enableRowsDropdown}
              rowsPerPageOptions={modifiedOptionsList}
              rowsPerPageNum={JSON.stringify(rowsPerPageNum)}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          ) : undefined,
        },
      }}
    />
  );
});

// Main Datatable component
const Datatable = forwardRef<
  { resetPagination: () => { activePage: number; rowsPerPageNum: number } },
  DatatableInterface
>(({ config, ...rest }, ref) => {
  const paginationConfig = { enablePagination: true, ...config?.pagination };
  const enhancedConfig = { ...config, pagination: paginationConfig };

  // Type guards to determine pagination mode
  const isRemotePagination = !!(paginationConfig as any)?.remoteControl;
  const isCustomPagination = !!(paginationConfig as any)?.paginationComponent;

  return (
    <>
      {enhancedConfig.pagination.enablePagination ? (
        isCustomPagination ? (
          <RootDatatable {...rest} config={enhancedConfig as any} />
        ) : isRemotePagination ? (
          <RemoteControlledDatatable {...rest} config={enhancedConfig as any} ref={ref} />
        ) : (
          <LocalControlledDatatable {...rest} config={enhancedConfig as any} ref={ref} />
        )
      ) : (
        <RootDatatable {...rest} config={enhancedConfig as any} />
      )}
    </>
  );
});

LocalControlledDatatable.displayName = 'LocalControlledDatatable';
RemoteControlledDatatable.displayName = 'RemoteControlledDatatable';
Datatable.displayName = 'Datatable';

export default Datatable;
