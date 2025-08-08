import { ReactNode, CSSProperties } from 'react';
import { TooltipPositionEnum, TooltipTriggerEnum } from '@/components/shared/tooltip/Tooltip.types';
import {
  ColumnOrderType,
  SortIconsInterface,
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
  RowInfo,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { DatatableRowEvents } from '@/components/shared/datatable/datatableBodyRow/DatatableBodyRow.types';

export type {
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
  DatatableRowEvents,
  RowInfo,
};
import { TitlePositionType } from '@/components/shared/datatable/datatableTitle/DatatableTitle.types';
import { ButtonInterface } from '@/components/shared/button/Button.types';
import { DeepLinkingConfig } from '@/hooks/usePagination';

export type BooleanFuncType<T = Record<string, any>> = (rowInfo: RowInfo<T>) => boolean;
export type TitleLocationType = 'searchRow' | 'titleRow';
export type ColumnVisibilityLocationType = TitleLocationType | 'actionsColumn';

export interface ActionTooltipInterface {
  tooltipContent: string; //can have jsx => tooltipContent="<em>hi</em>"
  position?: TooltipPositionEnum;
  color?: string;
  backgroundColor?: string;
  trigger?: TooltipTriggerEnum;
  className?: string;
  messageClassName?: string;
  isDisplayIndicator?: boolean;
}

interface UiConfigInterface extends SortIconsInterface {
  showTableHeader?: boolean;
  tableWrapperClassName?: string;
  tableClassName?: string;
  titleStyles?: CSSProperties;
  isActionsColumnLast?: boolean;
  actionsColLabel?: string;
  actionsColWidth?: number | string;
  loadingIcon?: ReactNode;
  paginationRangeSeparatorLabel?: string;
}

export interface DatatableColumnVisibilityConfigInterface {
  show?: boolean;
  trigger?: ButtonInterface;
  defaultVisibleColumns?: string[];
  hiddenColumns?: string[];
  location?: ColumnVisibilityLocationType;
}

interface DatatableSearchConfigInterface {
  show?: boolean;
  onSearch?: (key: string) => void | Promise<void>;
  isLocalSearch?: boolean;
  isFullWidth?: boolean;
  placeholder?: string;
  searchDataTest?: string;
  searchPosition?: TitlePositionType;
  onUpdateFilteredRecordsCount?: (count: number) => void;
}

interface DatatableSortConfigInterface {
  isLocalSort?: boolean;
  onSorting?: (accessorKey: string, order: ColumnOrderType) => void | Promise<void>;
}

interface CommonConfigInterface<T = Record<string, unknown>> {
  ui?: UiConfigInterface;
}

export interface RootPaginationInterface {
  enablePagination?: boolean;
  paginationComponent?: ReactNode;
  resetPagination?: () => { activePage: number; rowsPerPageNum: number } | void | Promise<void>;
  firstContentIndex?: number;
  lastContentIndex?: number;
}

interface DatatableTitleConfigInterface {
  titleLabel?: string | ReactNode;
  titlePosition?: TitlePositionType;
  titleLocation?: TitleLocationType;
  titleButtons?: ButtonInterface[];
  titleButtonsPosition?: TitlePositionType;
  titleButtonsLocation?: TitleLocationType;
}

// Base datatable interface that all components use
export interface DatatableInterface<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  actions?: ActionDef<T>[];
  records: T[];
  title?: DatatableTitleConfigInterface;
  isLoading?: boolean;
  dataTest?: string;
  noDataToDisplayMessage?: ReactNode;
  columnVisibility?: DatatableColumnVisibilityConfigInterface;
  search?: DatatableSearchConfigInterface;
  sort?: DatatableSortConfigInterface;
  selection?: DatatableSelectionConfigInterface<T>;
  pagination?: DatatablePaginationConfig;
  rowEvents?: DatatableRowEvents<T>;
  config?: CommonConfigInterface<T>;
}

// New interfaces for enhanced pagination support
export interface DatatableRowsDropdownOption {
  value: number;
  displayValue: string;
}

export interface LocalControlledPaginationInterface {
  enablePagination?: boolean;
  rowsDropdown?: {
    enableRowsDropdown?: boolean;
    rowsPerPage?: number;
    optionsList?: DatatableRowsDropdownOption[];
  };
  deepLinking?: DeepLinkingConfig;
}

export interface RemoteControlledPaginationInterface {
  enablePagination?: boolean;
  rowsDropdown?: {
    enableRowsDropdown?: boolean;
    rowsPerPage?: number;
    optionsList?: DatatableRowsDropdownOption[];
  };
  remoteControl: {
    onPaginationDataUpdate: (currentPage: number, rowsPerPageNum: number) => void | Promise<void>;
    totalRecords: number;
  };
  deepLinking?: DeepLinkingConfig;
}

// Union type for all possible pagination configurations
type DatatablePaginationConfig =
  | RootPaginationInterface
  | LocalControlledPaginationInterface
  | RemoteControlledPaginationInterface;

export interface DatatableRef {
  resetPagination: () => { activePage: number; rowsPerPageNum: number };
}
