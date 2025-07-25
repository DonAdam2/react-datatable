import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  ActionInterface,
  DatatableSelectionConfigInterface,
} from '@/components/shared/datatable/Datatable.types';

export interface SortIconsInterface {
  sortIcon?: ReactNode;
  ascendingSortIcon?: ReactNode;
  descendingSortIcon?: ReactNode;
}

export interface DatatableColumnInterface {
  field: string | 'action';
  colName?: string;
  className?: string;
  sortable?: boolean;
  render?: (rowData: any) => ReactNode;
  width?: string | number;
  noWrap?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  direction?: string;
}

export type ColumnOrderType = 'asc' | 'desc';
export type FieldType = string | 'actions';

export interface DatatableHeaderInterface extends SortIconsInterface {
  columns: DatatableColumnInterface[];
  onSorting?: (field: string, order: ColumnOrderType) => void;
  actions?: ActionInterface[];
  isActionsColumnLast?: boolean;
  actionsColLabel?: string;
  actionsColWidth?: number | string;
  selection?: DatatableSelectionConfigInterface;
  uniqueId: string;
  isSelectAllRecords: boolean;
  setIsSelectAllRecords: Dispatch<SetStateAction<boolean>>;
  candidateRecordsToSelectAll: any[];
}
