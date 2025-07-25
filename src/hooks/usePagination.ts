import { useCallback, useEffect, useState, useRef } from 'react';
import { getPaginationRange } from '@/constants/Helpers';
import useRouter from '@/hooks/useRouter';

// Define types for the hook parameters
interface DeepLinkingConfig {
  pageNumKey: string;
}

interface UsePaginationParams {
  contentPerPage: number;
  count: number;
  fetchData?: (page: number, perPage: number) => Promise<void>;
  deepLinking?: DeepLinkingConfig;
}

// Define return type for the hook
interface UsePaginationReturn {
  firstContentIndex?: number;
  lastContentIndex?: number;
  activePage: number;
  totalPages: number;
  paginationBlocks: (number | string)[];
  navigateToNextPage: () => Promise<void>;
  navigateToPrevPage: () => Promise<void>;
  navigateToPage: (num: number, newContentPerPage?: number) => Promise<void>;
  navigateToFirstPage: () => Promise<void>;
  navigateToLastPage: () => Promise<void>;
  updateCurrentRowsPerPage: (newContentPerPage: number) => Promise<void>;
  navigateToNextPaginationBlock: () => Promise<void>;
  navigateToPrevPaginationBlock: () => Promise<void>;
}

function usePagination({
  contentPerPage,
  count,
  fetchData,
  deepLinking,
}: UsePaginationParams): UsePaginationReturn {
  const [activePage, setActivePage] = useState<number>(1);
  const [paginationBlocks, setPaginationBlocks] = useState<(number | string)[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);

  // Track if we've initialized the URL
  const hasInitializedUrl = useRef<boolean>(false);

  // Always call useRouter hook to comply with Rules of Hooks
  const routerData = useRouter();
  // Only destructure and use when deepLinking is provided
  const { setSearchParams, location } = deepLinking ? routerData : {};

  // Basic pagination indexes (only calculated for non-async mode)
  const lastContentIndex: number | null = !fetchData ? activePage * contentPerPage : null;
  const firstContentIndex: number | null = !fetchData ? lastContentIndex! - contentPerPage : null;

  const initialPagesDisplayNum = 5;

  useEffect(() => {
    // number of pages in total (total items / content on each page)
    setPageCount(Math.ceil(count / contentPerPage));
  }, [count, contentPerPage]);

  const getPaginationBlocks = useCallback(
    (activePageNum: number): void => {
      const totalNumbers = initialPagesDisplayNum;
      const totalBlocks = totalNumbers + 2;

      if (pageCount > totalBlocks) {
        let pages: number[] = [];

        const leftBound = activePageNum - 1;
        const rightBound = activePageNum + 1;
        const beforeLastPage = pageCount - 1;
        const startPage = leftBound > 2 ? leftBound : 2;
        const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

        pages = getPaginationRange(startPage, endPage);

        const pagesCount = pages.length;
        const singleSpillOffset = totalNumbers - pagesCount - 1;
        const leftSpill = startPage > 2;
        const rightSpill = endPage < beforeLastPage;

        if (leftSpill && !rightSpill) {
          const extraPages = getPaginationRange(startPage - singleSpillOffset, startPage - 1);
          pages = ['LEFT', ...extraPages, ...pages] as number[];
        } else if (!leftSpill && rightSpill) {
          const extraPages = getPaginationRange(endPage + 1, endPage + singleSpillOffset);
          pages = [...pages, ...extraPages, 'RIGHT'] as number[];
        } else if (leftSpill && rightSpill) {
          pages = ['LEFT', ...pages, 'RIGHT'] as number[];
        }
        setPaginationBlocks([1, ...pages, pageCount]);
      } else {
        setPaginationBlocks(getPaginationRange(1, pageCount));
      }
    },
    [pageCount]
  );

  // Update pagination blocks when activePage or pageCount changes
  useEffect(() => {
    if (pageCount > 0) {
      getPaginationBlocks(activePage);
    }
  }, [pageCount, activePage, getPaginationBlocks]);

  // Deep linking: One-time initialization only
  useEffect(() => {
    if (deepLinking && pageCount > 0 && setSearchParams && !hasInitializedUrl.current) {
      hasInitializedUrl.current = true;

      const currentSearchParams = new URLSearchParams(location?.search || '');
      const pageFromUrl = currentSearchParams.get(deepLinking.pageNumKey);

      if (!pageFromUrl) {
        // No page parameter, add page=1
        console.log('Deep linking: Initializing URL with page=1');
        setSearchParams({ [deepLinking.pageNumKey]: '1' });
      } else {
        // Page exists, sync state to URL
        const urlPage = +pageFromUrl;
        if (urlPage >= 1 && urlPage <= pageCount && urlPage !== activePage) {
          setActivePage(urlPage);
        }
      }
    }
    //eslint-disable-next-line
  }, [deepLinking, pageCount, setSearchParams, location?.search]);

  // Deep linking: Listen for external URL changes (browser navigation)
  useEffect(() => {
    if (deepLinking && pageCount > 0 && hasInitializedUrl.current) {
      const currentSearchParams = new URLSearchParams(location?.search || '');
      const pageFromUrl = currentSearchParams.get(deepLinking.pageNumKey);

      if (pageFromUrl) {
        const urlPage = +pageFromUrl;
        if (urlPage >= 1 && urlPage <= pageCount && urlPage !== activePage) {
          setActivePage(urlPage);
        }
      }
    }
  }, [location?.search, deepLinking, pageCount, activePage]);

  // Deep linking specific functions
  const updatePageNum = useCallback(
    (num: number): void => {
      if (deepLinking && setSearchParams) {
        setSearchParams({ [deepLinking.pageNumKey]: num.toString() });
      }
    },
    [deepLinking, setSearchParams]
  );

  const updatePaginationBlocks = useCallback(
    async (activePageNum: number, newContentPerPage?: number): Promise<void> => {
      try {
        // Handle async pagination
        if (fetchData) {
          await fetchData(activePageNum, newContentPerPage ?? contentPerPage);
        }

        // Handle deep linking - only update URL, let URL effect handle state
        if (deepLinking) {
          updatePageNum(activePageNum);
        } else {
          // Non-deep linking mode - update state directly
          setActivePage(activePageNum);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [fetchData, contentPerPage, deepLinking, updatePageNum]
  );

  // Change page based on direction either front or back
  const changePage = async (isNextPage: boolean): Promise<void> => {
    try {
      const newPage = isNextPage ? activePage + 1 : activePage - 1;

      if (isNextPage) {
        if (activePage !== pageCount && count > 0) {
          // Handle async pagination
          if (fetchData) {
            await fetchData(newPage, contentPerPage);
          }

          // Handle deep linking - only update URL, let URL effect handle state
          if (deepLinking) {
            updatePageNum(newPage);
          }
        }
      } else {
        if (activePage !== 1 && count > 0) {
          // Handle async pagination
          if (fetchData) {
            await fetchData(newPage, contentPerPage);
          }

          // Handle deep linking - only update URL, let URL effect handle state
          if (deepLinking) {
            updatePageNum(newPage);
          }
        }
      }

      // Only update activePage for non-deep linking mode
      if (!deepLinking) {
        setActivePage((prev: number) => {
          if (isNextPage) {
            if (prev === pageCount) {
              return prev;
            }
            return prev + 1;
          } else {
            if (prev === 1) {
              return prev;
            }
            return prev - 1;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const navigateToPage = async (num: number, newContentPerPage?: number): Promise<void> => {
    try {
      if (num > pageCount) {
        await updatePaginationBlocks(pageCount, newContentPerPage);
      } else if (num < 1) {
        await updatePaginationBlocks(1, newContentPerPage);
      } else if (num !== activePage) {
        await updatePaginationBlocks(num, newContentPerPage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const navigateToFirstOrLastPage = async (isFirstPage: boolean): Promise<void> => {
    try {
      const targetPage = isFirstPage ? 1 : pageCount;

      if (isFirstPage) {
        if (activePage !== 1 && count > 0) {
          // Handle async pagination
          if (fetchData) {
            await fetchData(targetPage, contentPerPage);
          }

          // Handle deep linking - only update URL, let URL effect handle state
          if (deepLinking) {
            updatePageNum(targetPage);
          }
        }
      } else {
        if (activePage !== pageCount && count > 0) {
          // Handle async pagination
          if (fetchData) {
            await fetchData(targetPage, contentPerPage);
          }

          // Handle deep linking - only update URL, let URL effect handle state
          if (deepLinking) {
            updatePageNum(targetPage);
          }
        }
      }

      // Only update activePage for non-deep linking mode
      if (!deepLinking) {
        setActivePage(targetPage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const navigateToNextOrPrevPaginationBlock = async (isNextBlock: boolean): Promise<void> => {
    try {
      if (isNextBlock) {
        const activePageNum = activePage + 3;
        if (activePageNum >= pageCount) {
          await updatePaginationBlocks(pageCount);
        } else if (!paginationBlocks.includes('LEFT')) {
          const targetPage = initialPagesDisplayNum + 2;
          if (targetPage >= pageCount) {
            await updatePaginationBlocks(pageCount);
          } else {
            await updatePaginationBlocks(targetPage);
          }
        } else {
          await updatePaginationBlocks(activePageNum);
        }
      } else {
        const activePageNum = activePage - 3;
        if (activePageNum <= 1) {
          await updatePaginationBlocks(1);
        } else if (!paginationBlocks.includes('RIGHT')) {
          const num = (paginationBlocks[2] as number) - 2;
          await updatePaginationBlocks(num);
        } else {
          await updatePaginationBlocks(activePageNum);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateCurrentRowsPerPage = async (newContentPerPage: number): Promise<void> => {
    try {
      const newPageCount = Math.ceil(count / newContentPerPage);

      // If active page > newPageCount => set active page to newPageCount
      if (activePage > newPageCount) {
        const newActivePage = newPageCount === 0 ? 1 : newPageCount;

        if (fetchData) {
          await fetchData(newActivePage, newContentPerPage);
        }

        // Handle deep linking - update URL, let URL effect handle state
        if (deepLinking) {
          updatePageNum(newActivePage);
        } else {
          // Non-deep linking mode - update state directly
          setActivePage(newActivePage);
        }
      } else if (fetchData) {
        await fetchData(activePage, newContentPerPage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    // Include firstContentIndex and lastContentIndex only for non-async mode
    ...(firstContentIndex !== null && { firstContentIndex }),
    ...(lastContentIndex !== null && { lastContentIndex }),
    activePage,
    totalPages: pageCount,
    paginationBlocks,
    navigateToNextPage: () => changePage(true),
    navigateToPrevPage: () => changePage(false),
    navigateToPage,
    navigateToFirstPage: () => navigateToFirstOrLastPage(true),
    navigateToLastPage: () => navigateToFirstOrLastPage(false),
    updateCurrentRowsPerPage,
    navigateToNextPaginationBlock: () => navigateToNextOrPrevPaginationBlock(true),
    navigateToPrevPaginationBlock: () => navigateToNextOrPrevPaginationBlock(false),
  };
}

export default usePagination;
