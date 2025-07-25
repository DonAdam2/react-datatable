import {
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { Dispatch, SetStateAction } from 'react';

// Extended row type with optional UI interaction properties
type RowWithUIProps<T> = T & {
  onClick?: (e: import('react').MouseEvent, row: T) => void;
  onDoubleClick?: (e: import('react').MouseEvent, row: T) => void;
  isDroppable?: boolean;
  onDrop?: (e: import('react').DragEvent, row: T) => void;
  draggable?: boolean;
  onDragStart?: (e: import('react').DragEvent, row: T) => void;
};

export interface DatatableBodyRowInterface<T = any> {
  columns: ColumnDef<T>[];
  row: RowWithUIProps<T>;
  actions?: ActionDef<T>[];
  isActionsColumnLast?: boolean;
  actionsColLabel?: string;
  actionsColWidth?: number | string;
  selection?: DatatableSelectionConfigInterface<T>;
  uniqueId: string;
  isSelectAllRecords: boolean;
  setIsSelectAllRecords: Dispatch<SetStateAction<boolean>>;
  candidateRecordsToSelectAll: T[];
}
