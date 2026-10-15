import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import DragHandleIcon from '@/assets/icons/DragHandleIcon';
import {
  ColumnDef,
  DatatableHeaderInterface,
  RowInfo,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { ChangeEvent, useEffect, useState, DragEvent } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
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
  enableColumnOrdering = false,
  onColumnReorder,
  columnPreview,
  columnPreviewOffset,
  columnPreviewClassName,
}: DatatableHeaderInterface<T>) => {
  const [sortingField, setSortingField] = useState(''),
    [sortingOrder, setSortingOrder] = useState('asc'),
    [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null),
    [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);

  const actionsColumnData = {
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

  // Column reordering handlers
  const handleDragStart = (e: DragEvent<HTMLElement>, columnAccessorKey: string) => {
    if (!enableColumnOrdering) {
      return;
    }

    // Store the column accessor key instead of index
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnAccessorKey);
    e.dataTransfer.setData('application/x-column-reorder', columnAccessorKey);

    // Find the index in the actual columns array (not updatedColumns)
    const columnIndex = columns.findIndex((col) => String(col.accessorKey) === columnAccessorKey);

    setDraggedColumnIndex(columnIndex);

    // Build a drag image for the dragged column.
    const table = (e.target as HTMLElement).closest('table');
    const headerCell = (e.target as HTMLElement).closest('th');

    if (table && headerCell) {
      // Find the DOM column index by getting the position of this th in the header row
      const headerRow = headerCell.parentElement;
      const domColumnIndex = headerRow ? Array.from(headerRow.children).indexOf(headerCell) : -1;

      // Match the real rendered column width so the preview looks like the lifted column
      const columnWidth = headerCell.getBoundingClientRect().width;

      // Wrap the preview in a transparent, transform-free wrapper so a gap between the
      // cursor and the preview is honored (anchored at the cursor-side corner). In RTL the
      // preview is mirrored to the left of the cursor.
      const gapX = columnPreviewOffset?.x ?? 10;
      const gapY = columnPreviewOffset?.y ?? 10;
      const isRtl = getComputedStyle(headerCell).direction === 'rtl';
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.top = '-10000px';
      wrapper.style.left = '-10000px';
      wrapper.style.paddingTop = `${gapY}px`;
      if (isRtl) {
        wrapper.style.paddingRight = `${gapX}px`;
      } else {
        wrapper.style.paddingLeft = `${gapX}px`;
      }

      const draggedColumn = columns.find((col) => String(col.accessorKey) === columnAccessorKey);

      let cleanup: () => void;

      if (columnPreview && draggedColumn) {
        // Render the consumer-supplied preview into an off-screen element
        const inner = document.createElement('div');
        wrapper.appendChild(inner);
        document.body.appendChild(wrapper);

        const root = createRoot(inner);
        // flushSync ensures the preview is in the DOM before setDragImage reads it
        flushSync(() => {
          root.render(columnPreview(draggedColumn as ColumnDef));
        });

        cleanup = () => {
          root.unmount();
          document.body.removeChild(wrapper);
        };
      } else {
        // Default: a clone of the column (header + cells) at its real width. The visual
        // styling lives in the .column-drag-image* CSS classes so it can be overridden,
        // and columnPreviewClassName is appended for per-table customization.
        const dragImg = document.createElement('div');
        dragImg.className = cx('column-drag-image', columnPreviewClassName);
        dragImg.style.width = `${columnWidth}px`;

        // Clone the header cell, showing its full content
        const headerClone = headerCell.cloneNode(true) as HTMLElement;
        headerClone.className = 'column-drag-image-header';
        headerClone.style.width = '100%';
        dragImg.appendChild(headerClone);

        // Clone every rendered data cell in this column with full content (no truncation)
        const tbody = table.querySelector('tbody');
        if (tbody && domColumnIndex >= 0) {
          const rows = Array.from(tbody.querySelectorAll('tr'));
          rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const sourceCell = cells[domColumnIndex];
            if (sourceCell) {
              const cellClone = sourceCell.cloneNode(true) as HTMLElement;
              cellClone.className = 'column-drag-image-cell';
              // Override the cloned cell's inline width constraints
              cellClone.style.width = '100%';
              cellClone.style.minWidth = 'unset';
              cellClone.style.maxWidth = 'none';
              dragImg.appendChild(cellClone);
            }
          });
        }

        wrapper.appendChild(dragImg);
        document.body.appendChild(wrapper);

        cleanup = () => {
          document.body.removeChild(wrapper);
        };
      }

      e.dataTransfer.setDragImage(wrapper, isRtl ? wrapper.offsetWidth : 0, 0);

      // Clean up drag image after a short delay
      setTimeout(cleanup, 100);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLElement>, columnAccessorKey: string) => {
    if (!enableColumnOrdering) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    // Track which column is being dragged over for visual feedback (drop target indicator)
    const columnIndex = columns.findIndex((col) => String(col.accessorKey) === columnAccessorKey);
    setDragOverColumnIndex(columnIndex);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    if (!enableColumnOrdering) return;
    // Only clear when actually leaving the th (not when moving to a child element)
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragOverColumnIndex(null);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLElement>, dropAccessorKey: string) => {
    if (!enableColumnOrdering || draggedColumnIndex === null) return;

    e.preventDefault();

    // Find the drop column index in the actual columns array
    const dropColumnIndex = columns.findIndex((col) => String(col.accessorKey) === dropAccessorKey);

    // Reorder columns on drop
    if (draggedColumnIndex !== dropColumnIndex && dropColumnIndex !== -1) {
      await onColumnReorder?.(draggedColumnIndex, dropColumnIndex);
    }
  };

  const handleDragEnd = () => {
    // Reset drag state
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);

    // Reset all th elements to not be draggable
    const allThElements = document.querySelectorAll('th[draggable="true"]');
    allThElements.forEach((th) => {
      (th as HTMLElement).draggable = false;
    });
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

  // Helper function to check if a column is reorderable
  const isColumnReorderable = (accessorKey: string, enableOrdering?: boolean) => {
    if (!enableColumnOrdering) return false;
    if (accessorKey === actionsColumnName || accessorKey === selectionsColumnName) return false;

    // Check enableOrdering from the column - if explicitly set to false, column is not reorderable
    if (enableOrdering === false) return false;

    // If enableOrdering is not set or true, column is reorderable (default behavior)
    return true;
  };

  return (
    <thead className="table-header">
      <tr>
        {updatedColumns.map((column, index) => {
          const { accessorKey, header, enableSorting, width, className = '' } = column;
          const enableOrdering = 'enableOrdering' in column ? column.enableOrdering : undefined;
          const isReorderable = isColumnReorderable(String(accessorKey), enableOrdering);
          const columnIndex = isReorderable
            ? columns.findIndex((col) => String(col.accessorKey) === String(accessorKey))
            : -1;
          const isDragging = draggedColumnIndex === columnIndex;
          const isDraggedOver = dragOverColumnIndex === columnIndex;

          return (
            <th
              style={{
                width: getTableDataCellWidth({
                  width,
                  accessorKey: String(accessorKey),
                  columns: updatedColumns,
                  actions,
                }),
              }}
              key={String(accessorKey) || `column-${index}`}
              className={cx(className, {
                'actions-col-wrapper': accessorKey === actionsColumnName,
                'at-start': accessorKey === actionsColumnName && !isActionsColumnLast,
                'at-end': accessorKey === actionsColumnName && isActionsColumnLast,
                'selections-col-wrapper': accessorKey === selectionsColumnName,
                'column-reorderable': isReorderable,
                'column-dragging': isDragging,
                'column-drag-over': isDraggedOver && !isDragging,
              })}
              onDragStart={
                isReorderable ? (e) => handleDragStart(e, String(accessorKey)) : undefined
              }
              onDragEnd={isReorderable ? handleDragEnd : undefined}
              onDragEnter={
                isReorderable
                  ? (e) => {
                      e.preventDefault();
                    }
                  : undefined
              }
              onDragLeave={isReorderable ? handleDragLeave : undefined}
              onDragOver={isReorderable ? (e) => handleDragOver(e, String(accessorKey)) : undefined}
              onDrop={isReorderable ? (e) => handleDrop(e, String(accessorKey)) : undefined}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  width: '100%',
                }}
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
                    {enableSorting && (
                      <span
                        style={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        onClick={() => onSortingChange(String(accessorKey))}
                        title={`Sort by ${header}`}
                      >
                        {sortingField === accessorKey
                          ? sortingOrder === 'asc'
                            ? ascendingSortIcon
                            : descendingSortIcon
                          : sortIcon}
                      </span>
                    )}
                    {isReorderable && (
                      <span
                        className="column-drag-handle"
                        style={{
                          cursor: 'move',
                          display: 'inline-flex',
                          alignItems: 'center',
                          opacity: 0.7,
                          padding: '2px',
                          borderRadius: '2px',
                        }}
                        title="Drag to reorder this column"
                        onMouseDown={(e) => {
                          e.stopPropagation();

                          // Make the parent th draggable when starting from the handle
                          const thElement = e.currentTarget.closest('th');
                          if (thElement) {
                            thElement.draggable = true;
                          }
                        }}
                      >
                        <DragHandleIcon />
                      </span>
                    )}
                    {accessorKey === actionsColumnName && columnVisibilityToggle && (
                      <span style={{ marginInlineStart: 8 }}>{columnVisibilityToggle}</span>
                    )}
                  </>
                )}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default DatatableHeader;
