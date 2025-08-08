import { DragEvent, useRef, useState } from 'react';
import { DatatableBodyRowInterface } from '@/components/shared/datatable/datatableBodyRow/DatatableBodyRow.types';
import { RowInfo } from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
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
import { BooleanFuncType } from '@/components/shared/datatable/Datatable.types';

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
  columnVisibilityToggle,
  onDragEnd: onDragEndCallback,
}: DatatableBodyRowInterface<T>) => {
  const { isTouchDevice } = useTouchScreenDetect(),
    rowRef = useRef<HTMLTableRowElement>(null),
    [isDragging, setIsDragging] = useState(false),
    [isDraggedOver, setIsDraggedOver] = useState(false),
    // Helper function to get values from the row object
    getValue = (key: string) => getNestedValue({ key, obj: row }),
    // Row info object for cell functions
    rowInfo = { original: row, getValue },
    actionsColumnData = {
      accessorKey: actionsColumnName,
      header: actionsColLabel,
      width: actionsColWidth,
      minWidth: undefined,
      maxWidth: undefined,
      className: '',
      cell: (rowInfo: RowInfo<T>) => (
        <>
          {actions?.map((el, i) => (
            <DatatableIconButton
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
      minWidth: undefined,
      maxWidth: undefined,
      cell: (rowInfo: RowInfo<T>) => (
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
                  rowInfo={rowInfo}
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
                  rowInfo={rowInfo}
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
    if (!isDraggedOver) {
      setIsDraggedOver(true);
    }
  };

  const onDragLeaveHandler = (e: DragEvent<HTMLTableRowElement>) => {
    // Only set drag over to false if we're actually leaving the row element
    if (!rowRef.current?.contains(e.relatedTarget as Node)) {
      setIsDraggedOver(false);
    }
  };

  const onDragEndHandler = () => {
    setIsDragging(false);
    setIsDraggedOver(false);
    onDragEndCallback?.();
  };

  const onDropHandler = (e: DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    setIsDraggedOver(false);
    if (rowEvents?.onDrop?.event) {
      rowEvents.onDrop.event(e, rowInfo);
    }
  };

  // Helper functions to check if row events are enabled
  const isClickEventEnabled = (
    eventConfig: { clickable?: boolean | BooleanFuncType<T> } | undefined
  ): boolean => {
    if (!eventConfig) return false;
    if (typeof eventConfig.clickable === 'function') {
      return eventConfig.clickable(rowInfo);
    }
    return eventConfig.clickable !== false;
  };

  const isDropEventEnabled = (
    eventConfig: { droppable?: boolean | BooleanFuncType<T> } | undefined
  ): boolean => {
    if (!eventConfig) return false;
    if (typeof eventConfig.droppable === 'function') {
      return eventConfig.droppable(rowInfo);
    }
    return eventConfig.droppable !== false;
  };

  const isDragEventEnabled = (
    eventConfig: { draggable?: boolean | BooleanFuncType<T> } | undefined
  ): boolean => {
    if (!eventConfig) return false;
    if (typeof eventConfig.draggable === 'function') {
      return eventConfig.draggable(rowInfo);
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
    ...((actions?.length || columnVisibilityToggle) && !isActionsColumnLast
      ? [actionsColumnData]
      : []),
    ...columns,
    ...((actions?.length || columnVisibilityToggle) && isActionsColumnLast
      ? [actionsColumnData]
      : []),
  ];

  return (
    <tr
      ref={rowRef}
      onClick={
        isClickEnabled
          ? (e) => {
              rowEvents?.onClick?.event(e, rowInfo);
            }
          : undefined
      }
      onDoubleClick={
        isDoubleClickEnabled
          ? (e) => {
              rowEvents?.onDoubleClick?.event(e, rowInfo);
            }
          : undefined
      }
      onDragOver={isDropEnabled ? onDragOverHandler : undefined}
      onDragLeave={isDropEnabled ? onDragLeaveHandler : undefined}
      onDrop={isDropEnabled ? onDropHandler : undefined}
      style={{ cursor: isClickEnabled || isDoubleClickEnabled ? 'pointer' : 'initial' }}
      className={cx(
        'body-tr',
        {
          'row-dragging': isDragging,
          'row-drag-over': isDraggedOver && isDropEnabled,
          'row-drop-target': isDropEnabled,
          'row-draggable': isDragEnabled,
        },
        // Always apply custom classes so CSS can target states properly
        rowEvents?.onDragStart?.className,
        rowEvents?.onDrop?.className
      )}
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
                {col.cell ? col.cell(rowInfo) : getNestedValue({ key: col.accessorKey, obj: row })}
              </div>
            )}
            {colIndex === 0 && isDragEnabled && !isTouchDevice && (
              <div
                draggable={true}
                onDragStart={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);

                  // Create a custom drag image with styling
                  if (rowRef.current && e.dataTransfer) {
                    const dragImage = rowRef.current.cloneNode(true) as HTMLElement;

                    // Apply default drag-image class and custom class if provided
                    const dragImageClasses = ['drag-image'];
                    if (rowEvents?.onDragStart?.className) {
                      dragImageClasses.push(rowEvents.onDragStart.className);
                    }
                    dragImage.className += ` ${dragImageClasses.join(' ')}`;

                    document.body.appendChild(dragImage);
                    e.dataTransfer.setDragImage(dragImage, 0, 0);

                    // Clean up the temporary drag image
                    setTimeout(() => {
                      document.body.removeChild(dragImage);
                    }, 0);
                  }

                  rowEvents?.onDragStart?.event(e, rowInfo);
                }}
                onDragEnd={onDragEndHandler}
                style={{
                  marginInlineStart: col.accessorKey === selectionsColumnName ? '20px' : '0px',
                  marginInlineEnd: col.accessorKey === selectionsColumnName ? '0px' : '10px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                className={cx(
                  'drag-handle',
                  {
                    'drag-handle-active': isDragging,
                  },
                  // Apply custom drag class to handle if provided
                  rowEvents?.onDragStart?.className && `${rowEvents.onDragStart.className}-handle`
                )}
              >
                <span className="move-element">{rowEvents?.onDragStart?.icon || <MoveIcon />}</span>
              </div>
            )}
            {colIndex === 0 &&
              isDragConfigured &&
              !isDragEnabled &&
              col.accessorKey !== selectionsColumnName &&
              !isTouchDevice && (
                // Placeholder to maintain consistent spacing when drag is configured but not enabled for this row
                <div className="drag-placeholder" />
              )}
            {col.accessorKey !== selectionsColumnName && (
              <div className={`${col.accessorKey === actionsColumnName ? 'actions-col' : ''}`}>
                {col.cell
                  ? col.cell(rowInfo)
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
