import {
  ActionTooltipInterface,
  BooleanFuncType,
} from '@/components/shared/datatable/Datatable.types';
import { ReactNode, MouseEvent } from 'react';

export interface DatatableIconButtonInterface {
  disabled?: boolean | BooleanFuncType;
  hidden?: boolean | BooleanFuncType;
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>, rowData: any) => void;
  cell?: (rowData: any) => ReactNode;
  rowData: any;
  tooltip?: ActionTooltipInterface;
}
