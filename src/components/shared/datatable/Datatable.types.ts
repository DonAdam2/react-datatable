import { ReactNode, MouseEvent } from 'react';
import { TooltipPositionEnum, TooltipTriggerEnum } from '@/components/shared/tooltip/Tooltip.types';

export type BooleanFuncType = (rowData: any) => boolean;
type SelectionModeType = 'radio' | 'checkbox';

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
