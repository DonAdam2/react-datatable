import {
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { Dispatch, SetStateAction, MouseEvent, DragEvent } from 'react';

// Extended row type with optional UI interaction properties
type RowWithUIProps<T> = T & {
  onClick?: (e: MouseEvent, row: T) => void;
  onDoubleClick?: (e: MouseEvent, row: T) => void;
  isDroppable?: boolean;
  onDrop?: (e: DragEvent, row: T) => void;
  draggable?: boolean;
  onDragStart?: (e: DragEvent, row: T) => void;
};

export interface DatatableBodyRowInterface<T = Record<string, unknown>> {
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
