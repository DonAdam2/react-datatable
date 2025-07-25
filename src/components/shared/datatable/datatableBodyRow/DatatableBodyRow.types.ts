import { DatatableColumnInterface } from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import {
  ActionInterface,
  DatatableSelectionConfigInterface,
} from '@/components/shared/datatable/Datatable.types';
import { Dispatch, SetStateAction } from 'react';

export interface DatatableBodyRowInterface {
  columns: DatatableColumnInterface[];
  row: any;
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
