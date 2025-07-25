import { DragEvent, useRef } from 'react';
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

const DatatableBodyRow = <T extends Record<string, any> = Record<string, unknown>>({
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
  rowEvents,
}: DatatableBodyRowInterface<T>) => {
  const { isTouchDevice } = useTouchScreenDetect(),
    rowRef = useRef<HTMLTableRowElement>(null),
    actionsColumnData = {
      accessorKey: actionsColumnName,
      header: actionsColLabel,
      width: actionsColWidth,
      minWidth: undefined,
      maxWidth: undefined,
      className: '',
      cell: (rowData: any) => (
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
      minWidth: undefined,
      maxWidth: undefined,
      cell: (rowData: any) => (
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

  // Helper functions to check if row events are enabled
  const isClickEventEnabled = (
    eventConfig: { clickable?: boolean | ((rowData: T) => boolean) } | undefined
  ): boolean => {
    if (!eventConfig) return false;
    if (typeof eventConfig.clickable === 'function') {
      return eventConfig.clickable(row);
    }
    return eventConfig.clickable !== false;
  };

  const isDropEventEnabled = (
    eventConfig: { droppable?: boolean | ((rowData: T) => boolean) } | undefined
  ): boolean => {
    if (!eventConfig) return false;
    if (typeof eventConfig.droppable === 'function') {
      return eventConfig.droppable(row);
    }
    return eventConfig.droppable !== false;
  };

  const isDragEventEnabled = (
    eventConfig: { draggable?: boolean | ((rowData: T) => boolean) } | undefined
  ): boolean => {
    if (!eventConfig) return false;
    if (typeof eventConfig.draggable === 'function') {
      return eventConfig.draggable(row);
    }
    return eventConfig.draggable !== false;
  };

  const isClickEnabled = rowEvents?.onClick && isClickEventEnabled(rowEvents.onClick);
  const isDoubleClickEnabled =
    rowEvents?.onDoubleClick && isClickEventEnabled(rowEvents.onDoubleClick);
  const isDropEnabled = rowEvents?.onDrop && isDropEventEnabled(rowEvents.onDrop);
  const isDragEnabled = rowEvents?.onDragStart && isDragEventEnabled(rowEvents.onDragStart);
  const isDragConfigured = Boolean(rowEvents?.onDragStart); // Check if drag is configured for the table

  // Construct new columns
  const updatedColumns = [
    ...(selection !== undefined ? [selectionsColumnData] : []),
    ...(actions?.length && !isActionsColumnLast ? [actionsColumnData] : []),
    ...columns,
    ...(actions?.length && isActionsColumnLast ? [actionsColumnData] : []),
  ];

  return (
    <tr
      ref={rowRef}
      onClick={
        isClickEnabled
          ? (e) => {
              rowEvents?.onClick?.event(e, row);
            }
          : undefined
      }
      onDoubleClick={
        isDoubleClickEnabled
          ? (e) => {
              rowEvents?.onDoubleClick?.event(e, row);
            }
          : undefined
      }
      onDragOver={isDropEnabled ? onDragOverHandler : undefined}
      onDrop={
        isDropEnabled
          ? (e) => {
              rowEvents?.onDrop?.event(e, row);
            }
          : undefined
      }
      style={{ cursor: isClickEnabled || isDoubleClickEnabled ? 'pointer' : 'initial' }}
      className="body-tr"
    >
      {updatedColumns.map((col, colIndex) => (
        <td
          style={{
            width: getTableDataCellWidth<T>({
              width: col.width,
              accessorKey: String(col.accessorKey),
              columns: updatedColumns,
              actions,
            }),
            minWidth: col.minWidth ? col.minWidth : 'unset',
            maxWidth: col.maxWidth ? col.maxWidth : 'unset',
          }}
          key={String(col.accessorKey)}
          className={cx(`${col.className ? col.className : ''}`, {
            'actions-col-wrapper': col.accessorKey === actionsColumnName,
            'at-start': col.accessorKey === actionsColumnName && !isActionsColumnLast,
            'at-end': col.accessorKey === actionsColumnName && isActionsColumnLast,
            'selections-col-wrapper': col.accessorKey === selectionsColumnName,
          })}
        >
          <div className={`${colIndex === 0 ? 'is-flex is-align-items-center' : ''}`}>
            {colIndex === 0 && col.accessorKey === selectionsColumnName && (
              <div className="selection-col">
                {col.cell ? col.cell(row) : getNestedValue({ key: col.accessorKey, obj: row })}
              </div>
            )}
            {colIndex === 0 && isDragEnabled && !isTouchDevice && (
              <div
                draggable={true}
                onDragStart={(e) => {
                  e.stopPropagation();
                  // Set the drag image to be the entire row
                  if (rowRef.current && e.dataTransfer) {
                    e.dataTransfer.setDragImage(rowRef.current, 0, 0);
                  }
                  rowEvents?.onDragStart?.event(e, row);
                }}
                style={{
                  marginInlineStart: col.accessorKey === selectionsColumnName ? '20px' : '0px',
                  marginInlineEnd: col.accessorKey === selectionsColumnName ? '0px' : '10px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'grab',
                  flexShrink: 0,
                }}
              >
                <MoveIcon className="move-element" />
              </div>
            )}
            {colIndex === 0 &&
              isDragConfigured &&
              !isDragEnabled &&
              col.accessorKey !== selectionsColumnName &&
              !isTouchDevice && <div style={{ marginInlineEnd: '20px', width: '0px' }} />}
            {col.accessorKey !== selectionsColumnName && (
              <div className={`${col.accessorKey === actionsColumnName ? 'actions-col' : ''}`}>
                {col.cell
                  ? col.cell(row)
                  : getNestedValue({ key: String(col.accessorKey), obj: row })}
              </div>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
};

export default DatatableBodyRow;
