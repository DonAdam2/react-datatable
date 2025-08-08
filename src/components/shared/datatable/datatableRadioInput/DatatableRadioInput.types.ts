import { BooleanFuncType, RowInfo } from '@/components/shared/datatable/Datatable.types';
import { Dispatch, SetStateAction } from 'react';

export interface DatatableRadioInputInterface<T = Record<string, any>> {
  disabled?: boolean | BooleanFuncType<T>;
  hidden?: boolean | BooleanFuncType<T>;
  onSelectionChange: (data: T | T[]) => void;
  selectedData: any;
  dataKey: string;
  rowInfo: RowInfo<T>;
  name: string;
  className?: string;
  isSelectAllRecords?: boolean;
  setIsSelectAllRecords?: Dispatch<SetStateAction<boolean>>;
  candidateRecordsToSelectAll: any[];
}
