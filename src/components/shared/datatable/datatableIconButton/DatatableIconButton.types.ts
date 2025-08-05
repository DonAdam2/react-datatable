import {
  ActionTooltipInterface,
  RowInfo,
} from '@/components/shared/datatable/Datatable.types';
import { ReactNode, MouseEvent } from 'react';

export interface DatatableIconButtonInterface<T = Record<string, any>> {
  disabled?: boolean | ((rowInfo: RowInfo<T>) => boolean);
  hidden?: boolean | ((rowInfo: RowInfo<T>) => boolean);
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>, rowInfo: RowInfo<T>) => void;
  cell?: (rowInfo: RowInfo<T>) => ReactNode;
  rowInfo: RowInfo<T>;
  tooltip?: ActionTooltipInterface;
}
