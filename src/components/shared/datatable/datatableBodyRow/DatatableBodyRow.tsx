import { DragEvent } from 'react';
import { DatatableBodyRowInterface } from '@/components/shared/datatable/datatableBodyRow/DatatableBodyRow.types';
import useTouchScreenDetect from '@/hooks/useTouchScreenDetect';
import {
  actionsColumnName,
  selectionsColumnName,
  selectionsColumnWidth,
} from '../datatableHeader/DatatableHeader';
import DatatableIconButton from '@/components/shared/datatable/datatableIconButton/DatatableIconButton';
import DatatableRadioInput from '@/components/shared/datatable/datatableRadioInput/DatatableRadioInput';
import DatatableCheckbox from '@/components/shared/datatable/datatableCheckbox/DatatableCheckbox';
import { getNestedValue, getTableDataCellWidth } from '@/constants/Helpers';
import cx from 'classnames';
import MoveIcon from '@/assets/icons/MoveIcon';

const DatatableBodyRow = ({
  columns,
  row,
  actions,
  isActionsColumnLast,
  actionsColWidth,
  actionsColLabel,
  selection,
  uniqueId,
  isSelectAllRecords,
  setIsSelectAllRecords,
  candidateRecordsToSelectAll,
}: DatatableBodyRowInterface) => {
  const { isTouchDevice } = useTouchScreenDetect(),
    actionsColumnData = {
      accessorKey: actionsColumnName,
      colName: actionsColLabel,
      width: actionsColWidth,
      minWidth: undefined,
      maxWidth: undefined,
      className: '',
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
      colName: '',
      className: 'selections-col-wrapper',
      width: selectionsColumnWidth,
      minWidth: undefined,
      maxWidth: undefined,
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
                  isSelectAllRecords={isSelectAllRecords}
                  setIsSelectAllRecords={setIsSelectAllRecords}
                  candidateRecordsToSelectAll={candidateRecordsToSelectAll}
                />
              )}
            </>
          )}
        </>
      ),
    };

  const onDragOverHandler = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  // Construct new columns
  const updatedColumns = [
    ...(selection !== undefined ? [selectionsColumnData] : []),
    ...(actions?.length && !isActionsColumnLast ? [actionsColumnData] : []),
    ...columns,
    ...(actions?.length && isActionsColumnLast ? [actionsColumnData] : []),
  ];

  return (
    <tr
      onClick={
        row.onClick
          ? (e) => {
              row.onClick(e, row);
            }
          : undefined
      }
      onDoubleClick={
        row.onDoubleClick
          ? (e) => {
              row.onDoubleClick(e, row);
            }
          : undefined
      }
      onDragOver={row.isDroppable ? onDragOverHandler : undefined}
      onDrop={
        row.isDroppable && row.onDrop
          ? (e) => {
              row.onDrop(e, row);
            }
          : undefined
      }
      onDragStart={
        row.draggable && row.onDragStart
          ? (e) => {
              row.onDragStart(e, row);
            }
          : undefined
      }
      draggable={row.draggable}
      style={{ cursor: row.onClick ? 'pointer' : 'initial' }}
      className="body-tr"
    >
      {updatedColumns.map((col, colIndex) => (
        <td
          style={{
            width: getTableDataCellWidth({
              width: col.width,
              accessorKey: col.accessorKey,
              columns: updatedColumns,
              actions,
            }),
            minWidth: col.minWidth ? col.minWidth : 'unset',
            maxWidth: col.maxWidth ? col.maxWidth : 'unset',
          }}
          key={col.accessorKey}
          className={cx(`${col.className ? col.className : ''}`, {
            'actions-col-wrapper': col.accessorKey === actionsColumnName,
            'at-start': col.accessorKey === actionsColumnName && !isActionsColumnLast,
            'at-end': col.accessorKey === actionsColumnName && isActionsColumnLast,
            'selections-col-wrapper': col.accessorKey === selectionsColumnName,
          })}
        >
          <div
            className={`${
              colIndex === 0 && row.draggable && !isTouchDevice
                ? 'is-flex is-align-items-center'
                : ''
            }`}
          >
            {colIndex === 0 && col.accessorKey === selectionsColumnName && (
              <div className={`selection-col`}>
                {col.render ? col.render(row) : getNestedValue({ key: col.accessorKey, obj: row })}
              </div>
            )}
            {colIndex === 0 && row.draggable && !isTouchDevice && (
              <div
                style={{
                  marginInlineStart: col.accessorKey === selectionsColumnName ? 10 : 0,
                  marginInlineEnd: col.accessorKey === selectionsColumnName ? 0 : 24,
                  display: 'flex',
                }}
              >
                <MoveIcon className="move-element" />
              </div>
            )}
            {col.accessorKey !== selectionsColumnName && (
              <div className={`${col.accessorKey === actionsColumnName ? 'actions-col' : ''}`}>
                {col.render ? col.render(row) : getNestedValue({ key: col.accessorKey, obj: row })}
              </div>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
};

export default DatatableBodyRow;
