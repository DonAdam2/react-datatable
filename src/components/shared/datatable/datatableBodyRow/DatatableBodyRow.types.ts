import {
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
  RowInfo,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { Dispatch, SetStateAction, MouseEvent, DragEvent, ReactNode } from 'react';

// Row events interface similar to ActionDef pattern
export interface DatatableRowEvents<T = Record<string, unknown>> {
  onClick?: {
    clickable?: boolean | ((rowInfo: RowInfo<T>) => boolean);
    event: (e: MouseEvent, rowInfo: RowInfo<T>) => void;
  };
  onDoubleClick?: {
    clickable?: boolean | ((rowInfo: RowInfo<T>) => boolean);
    event: (e: MouseEvent, rowInfo: RowInfo<T>) => void;
  };
  onDrop?: {
    droppable?: boolean | ((rowInfo: RowInfo<T>) => boolean);
    event: (e: DragEvent, rowInfo: RowInfo<T>) => void;
    className?: string;
  };
  onDragStart?: {
    icon?: ReactNode;
    draggable?: boolean | ((rowInfo: RowInfo<T>) => boolean);
    event: (e: DragEvent, rowInfo: RowInfo<T>) => void;
    className?: string;
  };
}

export interface DatatableBodyRowInterface<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  row: T;
  actions?: ActionDef<T>[];
  isActionsColumnLast?: boolean;
  actionsColLabel?: string;
  actionsColWidth?: number | string;
  selection?: DatatableSelectionConfigInterface<T>;
  uniqueId: string;
  isSelectAllRecords: boolean;
  setIsSelectAllRecords: Dispatch<SetStateAction<boolean>>;
  candidateRecordsToSelectAll: T[];
  rowEvents?: DatatableRowEvents<T>;
  columnVisibilityToggle?: ReactNode;
  onDragEnd?: () => void;
}
