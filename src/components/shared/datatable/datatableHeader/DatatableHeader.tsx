import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import { DatatableHeaderInterface } from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { ChangeEvent, useEffect, useState } from 'react';
import DatatableIconButton from '../datatableIconButton/DatatableIconButton';
import DatatableRadioInput from '@/components/shared/datatable/datatableRadioInput/DatatableRadioInput';
import DatatableCheckbox from '@/components/shared/datatable/datatableCheckbox/DatatableCheckbox';
import cx from 'classnames';
import { getTableDataCellWidth } from '@/constants/Helpers';

export const actionsColumnName = 'actionsCol';
export const selectionsColumnName = 'selectionsCol';
export const selectionsColumnWidth = 25;

const DatatableHeader = ({
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
}: DatatableHeaderInterface) => {
  const [sortingField, setSortingField] = useState(''),
    [sortingOrder, setSortingOrder] = useState('asc'),
    actionsColumnData = {
      accessorKey: actionsColumnName,
      header: actionsColLabel,
      className: '',
      width: actionsColWidth,
      sortable: false,
      render: (rowData: any) => (
        <>
          {actions?.map((el, i) => (
            <DatatableIconButton
              key={i}
              disabled={el.disabled}
              hidden={el.hidden}
              icon={el.icon}
              onClick={el.onClick}
              rowData={rowData}
              tooltip={el.tooltip}
              render={el.render}
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
      sortable: false,
      render: (rowData: any) => (
        <>
          {selection?.onSelectionChange && (
            <>
              {selection.mode === 'radio' ? (
                <DatatableRadioInput
                  name={uniqueId}
                  disabled={selection?.disabled}
                  hidden={selection?.hidden}
                  onSelectionChange={selection?.onSelectionChange}
                  className={selection?.className}
                  dataKey={selection?.dataKey || ''}
                  rowData={rowData}
                  selectedData={selection.selectedData}
                  candidateRecordsToSelectAll={candidateRecordsToSelectAll}
                />
              ) : (
                <DatatableCheckbox
                  name={uniqueId}
                  disabled={selection?.disabled}
                  hidden={selection?.hidden}
                  onSelectionChange={selection?.onSelectionChange}
                  className={selection?.className}
                  dataKey={selection?.dataKey || ''}
                  rowData={rowData}
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
      const unSelectedRecords = candidateRecordsToSelectAll.filter(
        (candidate: any) =>
          !selection.selectedData.some(
            (record: any) => candidate[selection.dataKey] === record[selection.dataKey]
          )
      );
      if (isSelectAllRecords && unSelectedRecords.length) {
        selection.onSelectionChange([...selection.selectedData, ...unSelectedRecords]);
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
    ...(actions?.length && !isActionsColumnLast ? [actionsColumnData] : []),
    ...columns,
    ...(actions?.length && isActionsColumnLast ? [actionsColumnData] : []),
  ];

  return (
    <thead className="table-header">
      <tr>
        {updatedColumns.map(({ accessorKey, header, sortable, width, className = '' }) => (
          <th
            style={{
              width: getTableDataCellWidth({
                width,
                accessorKey,
                columns: updatedColumns,
                actions,
              }),
            }}
            key={accessorKey}
            className={cx(className, {
              'actions-col-wrapper': accessorKey === actionsColumnName,
              'at-start': accessorKey === actionsColumnName && !isActionsColumnLast,
              'at-end': accessorKey === actionsColumnName && isActionsColumnLast,
              'selections-col-wrapper': accessorKey === selectionsColumnName,
            })}
          >
            <span
              style={{ cursor: sortable ? 'pointer' : 'initial' }}
              onClick={() => (sortable ? onSortingChange(accessorKey) : null)}
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
                    selection?.onSelectionChange(checked ? candidateRecordsToSelectAll : []);
                  }}
                  className={selection?.className}
                  data-test="select-all-checkbox"
                />
              ) : (
                header
              )}
              {sortable && sortingField !== accessorKey && sortIcon}
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
