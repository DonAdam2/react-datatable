import { ReactNode, CSSProperties } from 'react';
import { TooltipPositionEnum, TooltipTriggerEnum } from '@/components/shared/tooltip/Tooltip.types';
import {
  ColumnOrderType,
  SortIconsInterface,
  ColumnDef,
  ActionDef,
  DatatableSelectionConfigInterface,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { DatatableRowEvents } from '@/components/shared/datatable/datatableBodyRow/DatatableBodyRow.types';

export type { ColumnDef, ActionDef, DatatableSelectionConfigInterface, DatatableRowEvents };
import { TitlePositionType } from '@/components/shared/datatable/datatableTitle/DatatableTitle.types';
import { ButtonInterface } from '@/components/shared/button/Button.types';
import { DeepLinkingConfig } from '@/hooks/usePagination';

export type BooleanFuncType = (rowData: any) => boolean;
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
  search?: DatatableSearchConfigInterface;
  sort?: DatatableSortConfigInterface;
  selection?: DatatableSelectionConfigInterface<T>;
  rowEvents?: DatatableRowEvents<T>;
  columnVisibility?: DatatableColumnVisibilityConfigInterface;
}

interface RootPaginationInterface {
  enablePagination?: boolean;
  paginationComponent?: ReactNode;
  resetPagination?: () => { activePage: number; rowsPerPageNum: number } | void | Promise<void>;
  firstContentIndex?: number;
  lastContentIndex?: number;
}

interface RootDatatableConfigInterface<T = Record<string, unknown>>
  extends CommonConfigInterface<T> {
  pagination?: RootPaginationInterface;
}

interface DatatableTitleConfigInterface {
  titleLabel?: string | ReactNode;
  titlePosition?: TitlePositionType;
  titleLocation?: TitleLocationType;
  titleButtons?: ButtonInterface[];
  titleButtonsPosition?: TitlePositionType;
  titleButtonsLocation?: TitleLocationType;
}

interface CommonDatatableInterface<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  actions?: ActionDef<T>[];
  records: T[];
  title?: DatatableTitleConfigInterface;
  isLoading?: boolean;
  dataTest?: string;
  noDataToDisplayMessage?: ReactNode;
}

export interface RootDatatableInterface<T = Record<string, unknown>>
  extends CommonDatatableInterface<T> {
  config?: RootDatatableConfigInterface<T>;
}

// New interfaces for enhanced pagination support
export interface DatatableRowsDropdownOption {
  value: number;
  displayValue: string;
}

interface LocalControlledPaginationInterface {
  enablePagination?: boolean;
  rowsDropdown?: {
    enableRowsDropdown?: boolean;
    rowsPerPage?: number;
    optionsList?: DatatableRowsDropdownOption[];
  };
  deepLinking?: DeepLinkingConfig;
}

interface RemoteControlledPaginationInterface {
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

// Enhanced datatable config interfaces
interface LocalControlledDatatableConfigInterface<T = Record<string, unknown>>
  extends CommonConfigInterface<T> {
  pagination?: LocalControlledPaginationInterface;
}

interface RemoteControlledDatatableConfigInterface<T = Record<string, unknown>>
  extends CommonConfigInterface<T> {
  pagination?: RemoteControlledPaginationInterface;
}

// Union type for all possible pagination configurations
type DatatablePaginationConfig =
  | RootPaginationInterface
  | LocalControlledPaginationInterface
  | RemoteControlledPaginationInterface;

// Enhanced datatable config interface
interface EnhancedDatatableConfigInterface<T = Record<string, unknown>>
  extends CommonConfigInterface<T> {
  pagination?: DatatablePaginationConfig;
}

// Enhanced datatable interface
export interface DatatableInterface<T = Record<string, unknown>>
  extends CommonDatatableInterface<T> {
  config?: EnhancedDatatableConfigInterface<T>;
}

// Individual component interfaces for internal use
export interface LocalControlledDatatableInterface<T = Record<string, unknown>>
  extends CommonDatatableInterface<T> {
  config?: LocalControlledDatatableConfigInterface<T>;
}

export interface RemoteControlledDatatableInterface<T = Record<string, unknown>>
  extends CommonDatatableInterface<T> {
  config?: RemoteControlledDatatableConfigInterface<T>;
}

export interface DatatableRef {
  resetPagination: () => { activePage: number; rowsPerPageNum: number };
}
