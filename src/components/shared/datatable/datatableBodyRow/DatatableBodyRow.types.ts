import {
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { Dispatch, SetStateAction, MouseEvent, DragEvent, ReactNode } from 'react';

// Row events interface similar to ActionDef pattern
export interface DatatableRowEvents<T = Record<string, unknown>> {
  onClick?: {
    clickable?: boolean | ((rowData: T) => boolean);
    event: (e: MouseEvent, row: T) => void;
  };
  onDoubleClick?: {
    clickable?: boolean | ((rowData: T) => boolean);
    event: (e: MouseEvent, row: T) => void;
  };
  onDrop?: {
    droppable?: boolean | ((rowData: T) => boolean);
    event: (e: DragEvent, row: T) => void;
  };
  onDragStart?: {
    draggable?: boolean | ((rowData: T) => boolean);
    event: (e: DragEvent, row: T) => void;
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
}
