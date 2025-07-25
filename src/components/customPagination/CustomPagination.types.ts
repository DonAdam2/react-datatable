export interface CustomPaginationInterface {
  activePage: number;
  totalPages: number;
  paginationBlocks: (number | string)[];
  navigateToPage: (num: number) => void | Promise<void>;
  navigateToNextPage: () => void;
  navigateToPrevPage: () => void;
  navigateToFirstPage: () => void;
  navigateToLastPage: () => void;
  navigateToNextPaginationBlock: () => void;
  navigateToPrevPaginationBlock: () => void;
  isDisplayNavigateToFirstOrLastPageButtons?: boolean;
}
