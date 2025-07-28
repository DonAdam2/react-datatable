import { Dispatch, ReactNode, SetStateAction, MouseEvent } from 'react';
import { ActionTooltipInterface } from '@/components/shared/datatable/Datatable.types';

export type SelectionModeType = 'radio' | 'checkbox';

export interface SortIconsInterface {
  sortIcon?: ReactNode;
  ascendingSortIcon?: ReactNode;
  descendingSortIcon?: ReactNode;
}

export interface ColumnDef<T = Record<string, any>> {
  accessorKey: keyof T | string | 'action';
  header?: ReactNode;
  className?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  cell?: (rowData: T) => ReactNode;
  width?: string | number;
  noWrap?: boolean;
  minWidth?: string | number;
  maxWidth?: string | number;
  direction?: string;
}

export type ColumnOrderType = 'asc' | 'desc';
export type AccessorKeyType = string | 'actions';

export interface DatatableHeaderInterface<T = Record<string, unknown>> extends SortIconsInterface {
  columns: ColumnDef<T>[];
  onSorting?: (accessorKey: string, order: ColumnOrderType) => void;
  actions?: ActionDef<T>[];
  isActionsColumnLast?: boolean;
  actionsColLabel?: string;
  actionsColWidth?: number | string;
  selection?: DatatableSelectionConfigInterface<T>;
  uniqueId: string;
  isSelectAllRecords: boolean;
  setIsSelectAllRecords: Dispatch<SetStateAction<boolean>>;
  candidateRecordsToSelectAll: T[];
  columnVisibilityToggle?: ReactNode;
}

export interface ActionDef<T = Record<string, unknown>> {
  icon?: ReactNode;
  disabled?: boolean | ((rowData: T) => boolean);
  hidden?: boolean | ((rowData: T) => boolean);
  tooltip?: ActionTooltipInterface;
  onClick?: (event: MouseEvent<HTMLButtonElement>, rowData: T) => void;
  cell?: (rowData: T) => ReactNode;
}

export interface DatatableSelectionConfigInterface<T = Record<string, unknown>> {
  disabled?: boolean | ((rowData: T) => boolean);
  hidden?: boolean | ((rowData: T) => boolean);
  mode: SelectionModeType;
  onSelectionChange: (rowData: T) => void;
  selectedData: T | T[] | null | undefined;
  className?: string;
  dataKey: Extract<keyof T, string> | string;
  selectAllCheckbox?: {
    disabled?: boolean;
    hidden?: boolean;
  };
}
