import { v4 as uuidv4 } from 'uuid';
import { RootDatatableInterface } from './Datatable.types';
import { useEffect, useMemo, useState } from 'react';
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
              await config?.search?.onSearch?.(value);
              resetPagination?.();
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

const Datatable = () => {
  return <div className="datatable-wrapper">Datatable</div>;
};

export default Datatable;
