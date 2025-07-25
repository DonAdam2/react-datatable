import { BooleanFuncType } from '@/components/shared/datatable/Datatable.types';
import { Dispatch, SetStateAction } from 'react';

export interface DatatableRadioInputInterface {
  disabled?: boolean | BooleanFuncType;
  hidden?: boolean | BooleanFuncType;
  onSelectionChange: (rowData: any) => void;
  selectedData: any;
  dataKey: string;
  rowData: any;
  name: string;
  className?: string;
  isSelectAllRecords?: boolean;
  setIsSelectAllRecords?: Dispatch<SetStateAction<boolean>>;
  candidateRecordsToSelectAll: any[];
}
