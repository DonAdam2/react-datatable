import { ReactNode, MouseEvent, CSSProperties } from 'react';
import { TooltipPositionEnum, TooltipTriggerEnum } from '@/components/shared/tooltip/Tooltip.types';
import {
  ColumnOrderType,
  DatatableColumnInterface,
  SortIconsInterface,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { TitlePositionType } from '@/components/shared/datatable/datatableTitle/DatatableTitle.types';
import { ButtonInterface } from '@/components/shared/button/Button.types';

export type BooleanFuncType = (rowData: any) => boolean;
type SelectionModeType = 'radio' | 'checkbox';
export type TitleLocationType = 'searchRow' | 'titleRow';

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

export interface ActionInterface {
  icon?: ReactNode;
  disabled?: boolean | BooleanFuncType;
  hidden?: boolean | BooleanFuncType;
  tooltip?: ActionTooltipInterface;
  onClick?: (event: MouseEvent<HTMLButtonElement>, rowData: any) => void;
  render?: (rowData: any) => ReactNode;
}

export interface DatatableSelectionConfigInterface {
  disabled?: boolean | BooleanFuncType;
  hidden?: boolean | BooleanFuncType;
  mode: SelectionModeType;
  onSelectionChange: (rowData: any) => void;
  selectedData: any;
  className?: string;
  dataKey: string;
  selectAllCheckbox?: {
    disabled?: boolean;
    hidden?: boolean;
  };
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
  onSorting?: (field: string, order: ColumnOrderType) => void | Promise<void>;
}

interface CommonConfigInterface {
  ui?: UiConfigInterface;
  search?: DatatableSearchConfigInterface;
  sort?: DatatableSortConfigInterface;
  selection?: DatatableSelectionConfigInterface;
}

interface RootPaginationInterface {
  enablePagination?: boolean;
  paginationComponent?: ReactNode;
  resetPagination?: () => { activePage: number; rowsPerPageNum: number } | void | Promise<void>;
  firstContentIndex?: number;
  lastContentIndex?: number;
}

interface RootDatatableConfigInterface extends CommonConfigInterface {
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

interface CommonDatatableInterface {
  columns: DatatableColumnInterface[];
  actions?: ActionInterface[];
  records: any[];
  title?: DatatableTitleConfigInterface;
  isLoading?: boolean;
  dataTest?: string;
  noDataToDisplayMessage?: ReactNode;
}

export interface RootDatatableInterface extends CommonDatatableInterface {
  config?: RootDatatableConfigInterface;
}

// New interfaces for enhanced pagination support
export interface DatatableRowsDropdownOption {
  value: number;
  displayValue: string;
}

interface DeepLinkingConfig {
  pageNumKey: string;
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
interface LocalControlledDatatableConfigInterface extends CommonConfigInterface {
  pagination?: LocalControlledPaginationInterface;
}

interface RemoteControlledDatatableConfigInterface extends CommonConfigInterface {
  pagination?: RemoteControlledPaginationInterface;
}

// Union type for all possible pagination configurations
type DatatablePaginationConfig =
  | RootPaginationInterface
  | LocalControlledPaginationInterface
  | RemoteControlledPaginationInterface;

// Enhanced datatable config interface
interface EnhancedDatatableConfigInterface extends CommonConfigInterface {
  pagination?: DatatablePaginationConfig;
}

// Enhanced datatable interface
export interface DatatableInterface extends CommonDatatableInterface {
  config?: EnhancedDatatableConfigInterface;
}

// Individual component interfaces for internal use
export interface LocalControlledDatatableInterface extends CommonDatatableInterface {
  config?: LocalControlledDatatableConfigInterface;
}

export interface RemoteControlledDatatableInterface extends CommonDatatableInterface {
  config?: RemoteControlledDatatableConfigInterface;
}

export interface DatatableRef {
  resetPagination: () => { activePage: number; rowsPerPageNum: number };
}
