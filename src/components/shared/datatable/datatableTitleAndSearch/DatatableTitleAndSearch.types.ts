import { DatatableTitleInterface } from '@/components/shared/datatable/datatableTitle/DatatableTitle.types';
import { DatatableSearchInterface } from '@/components/shared/datatable/datatableSearch/DatatableSearch.types';

export interface DatatableTitleAndSearchInterface extends DatatableTitleInterface {
  search?: DatatableSearchInterface;
}
