import { ColumnDef } from '../datatableHeader/DatatableHeader.types';
import { ButtonInterface } from '@/components/shared/button/Button.types';

export interface DatatableColumnVisibilityInterface<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
  trigger?: ButtonInterface;
}
