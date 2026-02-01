import AscendingSortIcon from '@/assets/icons/AscendingSortIcon';
import DescendingSortIcon from '@/assets/icons/DescendingSortIcon';
import FilterIcon from '@/assets/icons/FilterIcon';
import DragHandleIcon from '@/assets/icons/DragHandleIcon';
import {
  DatatableHeaderInterface,
  RowInfo,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { ChangeEvent, useEffect, useState, DragEvent } from 'react';
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

    // Create a drag image that shows the entire column
    const dragImg = document.createElement('div');
    dragImg.style.position = 'absolute';
    dragImg.style.top = '-10000px';
    dragImg.style.left = '-10000px';
    dragImg.style.backgroundColor = 'white';
    dragImg.style.border = '2px solid #3b82f6';
    dragImg.style.borderRadius = '6px';
    dragImg.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    dragImg.style.opacity = '0.9';
    dragImg.style.width = '200px';
    dragImg.style.height = '300px'; // Fixed height to ensure it fits
    dragImg.style.overflow = 'hidden';
    dragImg.style.display = 'flex';
    dragImg.style.flexDirection = 'column';

    // Get the table element to find all cells in this column
    const table = (e.target as HTMLElement).closest('table');
    const headerCell = (e.target as HTMLElement).closest('th');

    if (table && headerCell) {
      // Find the DOM column index by getting the position of this th in the header row
      const headerRow = headerCell.parentElement;
      const domColumnIndex = headerRow ? Array.from(headerRow.children).indexOf(headerCell) : -1;

      // Add header
      const headerClone = headerCell.cloneNode(true) as HTMLElement;
      headerClone.style.padding = '6px 10px';
      headerClone.style.backgroundColor = '#f3f4f6';
      headerClone.style.fontWeight = '600';
      headerClone.style.borderBottom = '1px solid #e5e7eb';
      headerClone.style.fontSize = '13px';
      headerClone.style.whiteSpace = 'nowrap';
      headerClone.style.overflow = 'visible';
      headerClone.style.textOverflow = 'initial';
      headerClone.style.width = 'auto';
      headerClone.style.minWidth = 'fit-content';
      dragImg.appendChild(headerClone);

      // Add data cells to match the visible table height
      const tbody = table.querySelector('tbody');
      if (tbody && domColumnIndex >= 0) {
        const allRows = Array.from(tbody.querySelectorAll('tr'));

        // Calculate how many rows to show based on available space
        // Show a reasonable number of rows that fits in the fixed drag image height
        const visibleRowCount = allRows.length;
        const maxRowsForPreview = 8; // Reduced to fit in 300px height
        const minRowsForGoodPreview = 4;
        const rowsToShow = Math.min(
          Math.max(visibleRowCount, minRowsForGoodPreview),
          maxRowsForPreview
        );

        // If we need to show more rows than exist, duplicate some rows for visual effect
        const rows = [];
        for (let i = 0; i < rowsToShow; i++) {
          if (i < allRows.length) {
            rows.push(allRows[i]);
          } else {
            // Duplicate rows cyclically to fill space
            rows.push(allRows[i % allRows.length]);
          }
        }
        rows.forEach((row) => {
          const cells = row.querySelectorAll('td');
          if (cells[domColumnIndex]) {
            const cellClone = cells[domColumnIndex].cloneNode(true) as HTMLElement;
            cellClone.style.padding = '4px 10px';
            cellClone.style.borderBottom = '1px solid #f3f4f6';
            cellClone.style.whiteSpace = 'nowrap';
            cellClone.style.overflow = 'visible';
            cellClone.style.textOverflow = 'initial';
            cellClone.style.width = 'auto';
            cellClone.style.minWidth = 'fit-content';
            cellClone.style.maxWidth = 'none';
            cellClone.style.fontSize = '12px';
            dragImg.appendChild(cellClone);
          }
        });

        // Add indicator if there are more rows than we're showing
        if (visibleRowCount > rowsToShow) {
          const moreIndicator = document.createElement('div');
          moreIndicator.textContent = `... ${visibleRowCount - rowsToShow} more rows`;
          moreIndicator.style.padding = '4px 12px';
          moreIndicator.style.textAlign = 'center';
          moreIndicator.style.color = '#6b7280';
          moreIndicator.style.fontStyle = 'italic';
          moreIndicator.style.fontSize = '11px';
          moreIndicator.style.backgroundColor = '#f9fafb';
          moreIndicator.style.borderTop = '1px solid #e5e7eb';
          dragImg.appendChild(moreIndicator);
        } else if (rowsToShow > visibleRowCount) {
          const moreIndicator = document.createElement('div');
          moreIndicator.textContent = `${visibleRowCount} total rows (preview)`;
          moreIndicator.style.padding = '4px 12px';
          moreIndicator.style.textAlign = 'center';
          moreIndicator.style.color = '#6b7280';
          moreIndicator.style.fontStyle = 'italic';
          moreIndicator.style.fontSize = '11px';
          moreIndicator.style.backgroundColor = '#f9fafb';
          moreIndicator.style.borderTop = '1px solid #e5e7eb';
          dragImg.appendChild(moreIndicator);
        }
      }
    }

    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 10, 10);

    // Clean up drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImg);
    }, 100);
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
