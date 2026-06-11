import { DragEvent, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
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

  // A column reorder drag (started from the header) tags its payload with this type.
  // Row drag/drop must ignore it so column sorting doesn't trigger row hover/drop.
  const isColumnReorderDrag = (e: DragEvent<HTMLTableRowElement>) =>
    Array.from(e.dataTransfer.types).includes('application/x-column-reorder');

  const onDragOverHandler = (e: DragEvent<HTMLTableRowElement>) => {
    if (isColumnReorderDrag(e)) return;
    e.preventDefault();
    if (!isDraggedOver) {
      setIsDraggedOver(true);
    }
  };

  const onDragLeaveHandler = (e: DragEvent<HTMLTableRowElement>) => {
    if (isColumnReorderDrag(e)) return;
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
    if (isColumnReorderDrag(e)) return;
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

                  if (e.dataTransfer) {
                    const customPreview = rowEvents?.onDragStart?.preview;
                    const previewOffset = rowEvents?.onDragStart?.previewOffset;
                    // The preview is shown with a small gap from the cursor: the cursor
                    // comes first, then the element offset down/right. previewOffset
                    // overrides the default 5px gap on each axis.
                    const rowRect = rowRef.current?.getBoundingClientRect();
                    const isRtl = rowRef.current
                      ? getComputedStyle(rowRef.current).direction === 'rtl'
                      : false;
                    const gapX = previewOffset?.x ?? 10;
                    const gapY = previewOffset?.y ?? 10;

                    if (customPreview) {
                      // Render the consumer-supplied preview into an off-screen container
                      // and use it as the drag image (similar to react-dnd).
                      // The element passed to setDragImage must NOT have a CSS transform,
                      // otherwise the browser ignores the offset. So the outer container
                      // (the drag-image target) stays transform-free and an inner element
                      // carries the .drag-image styling (which includes a rotate).
                      const container = document.createElement('div');
                      container.style.position = 'absolute';
                      container.style.top = '-10000px';
                      container.style.left = '-10000px';
                      container.style.pointerEvents = 'none';

                      const inner = document.createElement('div');
                      const previewClasses = ['drag-image'];
                      if (rowEvents?.onDragStart?.className) {
                        previewClasses.push(rowEvents.onDragStart.className);
                      }
                      inner.className = previewClasses.join(' ');
                      // The .drag-image rotate skews the preview diagonally; keep it straight.
                      inner.style.transform = 'none';
                      container.appendChild(inner);

                      document.body.appendChild(container);

                      const root = createRoot(inner);
                      // flushSync ensures the preview is in the DOM before setDragImage reads it
                      flushSync(() => {
                        root.render(customPreview(rowInfo));
                      });

                      // Inset the preview by the gap and anchor at the cursor-side corner so
                      // it's offset away from the cursor. In RTL the preview is mirrored to
                      // the left of the cursor; in LTR it sits to the right.
                      container.style.paddingTop = `${gapY}px`;
                      if (isRtl) {
                        container.style.paddingRight = `${gapX}px`;
                        e.dataTransfer.setDragImage(container, container.offsetWidth, 0);
                      } else {
                        container.style.paddingLeft = `${gapX}px`;
                        e.dataTransfer.setDragImage(container, 0, 0);
                      }

                      // Clean up the temporary preview
                      setTimeout(() => {
                        root.unmount();
                        document.body.removeChild(container);
                      }, 0);
                    } else if (rowRef.current) {
                      // Default: clone the full row as the drag image.
                      const rowClone = rowRef.current.cloneNode(true) as HTMLElement;

                      // A bare <tr> outside a <table> loses table layout, so the cells
                      // collapse together. Wrap the clone in a real table (matching the
                      // source table's width/styles) to preserve column spacing.
                      const sourceTable = rowRef.current.closest('table');

                      // The element passed to setDragImage must NOT have a CSS transform,
                      // otherwise the browser ignores the offset. So the outer wrapper (the
                      // drag-image target) stays transform-free, and the inner table carries
                      // the .drag-image styling (which includes a rotate).
                      const dragImage = document.createElement('div');
                      dragImage.style.position = 'absolute';
                      dragImage.style.top = '-10000px';
                      dragImage.style.left = '-10000px';

                      const previewTable = document.createElement('table');
                      previewTable.className = sourceTable?.className ?? '';
                      previewTable.style.borderCollapse = 'collapse';
                      previewTable.style.backgroundColor = 'white';
                      if (sourceTable) {
                        previewTable.style.width = `${sourceTable.getBoundingClientRect().width}px`;
                      }
                      // Match the preview height to the actual row height (the off-screen
                      // table otherwise loses the row height it gets from ancestor CSS).
                      if (rowRect) {
                        previewTable.style.height = `${rowRect.height}px`;
                        rowClone.style.height = `${rowRect.height}px`;
                      }

                      const tbody = document.createElement('tbody');
                      tbody.appendChild(rowClone);
                      previewTable.appendChild(tbody);

                      // Apply default drag-image class and custom class if provided
                      const dragImageClasses = ['drag-image'];
                      if (rowEvents?.onDragStart?.className) {
                        dragImageClasses.push(rowEvents.onDragStart.className);
                      }
                      previewTable.className += ` ${dragImageClasses.join(' ')}`;
                      // The .drag-image rotate looks like a diagonal skew on a full-width
                      // row, so keep the row preview straight.
                      previewTable.style.transform = 'none';

                      dragImage.appendChild(previewTable);
                      document.body.appendChild(dragImage);
                      // Inset the preview by the gap and anchor at the cursor-side corner so
                      // it's offset away from the cursor. In RTL the preview is mirrored to
                      // the left of the cursor; in LTR it sits to the right.
                      dragImage.style.paddingTop = `${gapY}px`;
                      if (isRtl) {
                        dragImage.style.paddingRight = `${gapX}px`;
                        e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth, 0);
                      } else {
                        dragImage.style.paddingLeft = `${gapX}px`;
                        e.dataTransfer.setDragImage(dragImage, 0, 0);
                      }

                      // Clean up the temporary drag image
                      setTimeout(() => {
                        document.body.removeChild(dragImage);
                      }, 0);
                    }
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
