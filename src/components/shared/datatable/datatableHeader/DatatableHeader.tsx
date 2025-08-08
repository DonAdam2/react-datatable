import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import {
  DatatableHeaderInterface,
  RowInfo,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { ChangeEvent, useEffect, useState } from 'react';
import DatatableIconButton from '../datatableIconButton/DatatableIconButton';
import DatatableRadioInput from '@/components/shared/datatable/datatableRadioInput/DatatableRadioInput';
import DatatableCheckbox from '@/components/shared/datatable/datatableCheckbox/DatatableCheckbox';
import cx from 'classnames';
import { getTableDataCellWidth } from '@/constants/Helpers';

export const actionsColumnName = 'actionsCol';
export const selectionsColumnName = 'selectionsCol';
export const selectionsColumnWidth = 25;

const DatatableHeader = <T extends Record<string, any> = Record<string, any>>({
  columns,
  actions,
  onSorting,
  sortIcon = <FilterIcon />,
  ascendingSortIcon = <AscendingSortIcon />,
  descendingSortIcon = <DescendingSortIcon />,
  actionsColWidth,
  actionsColLabel,
  isActionsColumnLast,
  selection,
  uniqueId,
  isSelectAllRecords,
  setIsSelectAllRecords,
  candidateRecordsToSelectAll,
  columnVisibilityToggle,
}: DatatableHeaderInterface<T>) => {
  const [sortingField, setSortingField] = useState(''),
    [sortingOrder, setSortingOrder] = useState('asc'),
    actionsColumnData = {
      accessorKey: actionsColumnName,
      header: actionsColLabel,
      className: '',
      width: actionsColWidth,
      enableSorting: false,
      cell: (rowInfo: RowInfo<T>) => (
        <>
          {actions?.map((el, i) => (
            <DatatableIconButton<T>
              key={i}
              disabled={el.disabled}
              hidden={el.hidden}
              icon={el.icon}
              onClick={el.onClick}
              rowInfo={rowInfo}
              tooltip={el.tooltip}
              cell={el.cell}
            />
          ))}
        </>
      ),
    },
    selectionsColumnData = {
      accessorKey: selectionsColumnName,
      header: '',
      className: 'selections-col-wrapper',
      width: selectionsColumnWidth,
      enableSorting: false,
      cell: (rowInfo: RowInfo<T>) => (
        <>
          {selection?.onSelectionChange && (
            <>
              {selection.mode === 'radio' ? (
                <DatatableRadioInput<T>
                  name={uniqueId}
                  disabled={selection?.disabled}
                  hidden={selection?.hidden}
                  onSelectionChange={selection?.onSelectionChange}
                  className={selection?.className}
                  dataKey={selection?.dataKey || ''}
                  rowInfo={rowInfo}
                  selectedData={selection.selectedData}
                  candidateRecordsToSelectAll={candidateRecordsToSelectAll}
                />
              ) : (
                <DatatableCheckbox<T>
                  name={uniqueId}
                  disabled={selection?.disabled}
                  hidden={selection?.hidden}
                  onSelectionChange={selection?.onSelectionChange}
                  className={selection?.className}
                  dataKey={selection?.dataKey || ''}
                  rowInfo={rowInfo}
                  selectedData={selection.selectedData}
                  setIsSelectAllRecords={setIsSelectAllRecords}
                  candidateRecordsToSelectAll={candidateRecordsToSelectAll}
                />
              )}
            </>
          )}
        </>
      ),
    };

  /* This useEffect is responsible for selecting records if selection mode is checkbox
   * and isSelectAllRecords is true (will work only if datatable is remotely controlled) */
  useEffect(() => {
    if (selection !== undefined && selection.mode === 'checkbox') {
      // Ensure selectedData is an array for checkbox mode
      const selectedDataArray = Array.isArray(selection.selectedData)
        ? selection.selectedData
        : selection.selectedData
          ? [selection.selectedData]
          : [];

      const unSelectedRecords = candidateRecordsToSelectAll.filter(
        (candidate: any) =>
          !selectedDataArray.some(
            (record: any) => candidate[selection.dataKey] === record[selection.dataKey]
          )
      );
      if (isSelectAllRecords && unSelectedRecords.length) {
        selection.onSelectionChange([...selectedDataArray, ...unSelectedRecords] as any);
      }
    }
  }, [isSelectAllRecords, selection, candidateRecordsToSelectAll]);

  const onSortingChange = async (accessorKey: string) => {
    const order = accessorKey === sortingField && sortingOrder === 'asc' ? 'desc' : 'asc';

    await onSorting?.(accessorKey, order);
    setSortingField(accessorKey);
    setSortingOrder(order);
  };

  // Construct new columns
  const updatedColumns = [
    ...(selection !== undefined ? [selectionsColumnData] : []),
    ...((actions?.length || columnVisibilityToggle) && !isActionsColumnLast
      ? [actionsColumnData]
      : []),
    ...columns,
    ...((actions?.length || columnVisibilityToggle) && isActionsColumnLast
      ? [actionsColumnData]
      : []),
  ];

  return (
    <thead className="table-header">
      <tr>
        {updatedColumns.map(({ accessorKey, header, enableSorting, width, className = '' }) => (
          <th
            style={{
              width: getTableDataCellWidth({
                width,
                accessorKey: String(accessorKey),
                columns: updatedColumns,
                actions,
              }),
            }}
            key={String(accessorKey)}
            className={cx(className, {
              'actions-col-wrapper': accessorKey === actionsColumnName,
              'at-start': accessorKey === actionsColumnName && !isActionsColumnLast,
              'at-end': accessorKey === actionsColumnName && isActionsColumnLast,
              'selections-col-wrapper': accessorKey === selectionsColumnName,
            })}
          >
            <span
              style={{ cursor: enableSorting ? 'pointer' : 'initial' }}
              onClick={() => (enableSorting ? onSortingChange(String(accessorKey)) : null)}
              className="table-head-label"
            >
              {accessorKey === selectionsColumnName &&
              selection?.mode === 'checkbox' &&
              !selection.selectAllCheckbox?.hidden ? (
                <input
                  type="checkbox"
                  disabled={selection.selectAllCheckbox?.disabled}
                  checked={isSelectAllRecords}
                  onChange={({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
                    setIsSelectAllRecords(checked);
                    selection?.onSelectionChange(
                      checked ? (candidateRecordsToSelectAll as any) : ([] as any)
                    );
                  }}
                  className={selection?.className}
                  data-test="select-all-checkbox"
                />
              ) : (
                <>
                  {header}
                  {accessorKey === actionsColumnName && columnVisibilityToggle && (
                    <span style={{ marginInlineStart: 8 }}>{columnVisibilityToggle}</span>
                  )}
                </>
              )}
              {enableSorting && sortingField !== accessorKey && sortIcon}
              {sortingField && sortingField === accessorKey && (
                <>{sortingOrder === 'asc' ? ascendingSortIcon : descendingSortIcon}</>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DatatableHeader;
