import { CustomPaginationInterface } from './CustomPagination.types';
import DoubleChevronLeftIcon from '@/assets/icons/DoubleChevronLeftIcon';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon';
import { Fragment } from 'react';
import Tooltip from '@/components/shared/tooltip/Tooltip';
import DotsHorizontalIcon from '@/assets/icons/DotsHorizontalIcon';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon';
import DoubleChevronRightIcon from '@/assets/icons/DoubleChevronRightIcon';

const CustomPagination = ({
  activePage,
  totalPages,
  paginationBlocks,
  navigateToPage,
  navigateToNextPage,
  navigateToPrevPage,
  navigateToFirstPage,
  navigateToLastPage,
  navigateToNextPaginationBlock,
  navigateToPrevPaginationBlock,
  isDisplayNavigateToFirstOrLastPageButtons = true,
}: CustomPaginationInterface) => {
  const isPrevButtonDisabled =
      activePage === 1 ||
      totalPages === 0 ||
      !paginationBlocks.includes(activePage) ||
      isNaN(totalPages),
    isNextButtonDisabled =
      activePage === totalPages ||
      totalPages === 0 ||
      !paginationBlocks.includes(activePage) ||
      isNaN(totalPages);

  return (
    <div className="custom-pagination-wrapper">
      <ul>
        {isDisplayNavigateToFirstOrLastPageButtons && (
          <li className="pagination-icon-wrapper first-page-nav-wrapper">
            <DoubleChevronLeftIcon
              onClick={navigateToFirstPage}
              className={`first-page-nav icon-path-stroke-dark transform-icon pagination-nav ${
                isPrevButtonDisabled ? 'disabled-el' : ''
              }`}
            />
          </li>
        )}
        <li className="pagination-icon-wrapper">
          <ChevronLeftIcon
            onClick={navigateToPrevPage}
            className={`pagination-nav icon-path-stroke-dark transform-icon ${
              isPrevButtonDisabled ? 'disabled-el' : ''
            }`}
          />
        </li>
        {paginationBlocks.length > 0 ? (
          paginationBlocks.map((el) => (
            <Fragment key={el}>
              {el === 'LEFT' && (
                <li onClick={navigateToPrevPaginationBlock} className="pagination-icon-wrapper">
                  <Tooltip className="is-inline-flex" tooltipContent="Previous 3 pages">
                    <DotsHorizontalIcon className="pagination-nav inner-pagination-nav icon-path-stroke-dark" />
                  </Tooltip>
                </li>
              )}
              {el !== 'LEFT' && el !== 'RIGHT' && (
                <li
                  onClick={() => navigateToPage(el as number)}
                  className={activePage === el ? 'active' : ''}
                >
                  <span className="pagination-link-number">{el}</span>
                </li>
              )}
              {el === 'RIGHT' && (
                <li onClick={navigateToNextPaginationBlock} className="pagination-icon-wrapper">
                  <Tooltip className="is-inline-flex" tooltipContent="Next 3 pages">
                    <DotsHorizontalIcon className="pagination-nav inner-pagination-nav icon-path-stroke-dark" />
                  </Tooltip>
                </li>
              )}
            </Fragment>
          ))
        ) : (
          <li className="active">
            <span className="pagination-link-number">1</span>
          </li>
        )}
        <li className="pagination-icon-wrapper last-page-nav-wrapper">
          <ChevronRightIcon
            onClick={navigateToNextPage}
            className={`pagination-nav icon-path-stroke-dark transform-icon ${
              isNextButtonDisabled ? 'disabled-el' : ''
            }`}
          />
        </li>
        {isDisplayNavigateToFirstOrLastPageButtons && (
          <li className="pagination-icon-wrapper">
            <DoubleChevronRightIcon
              onClick={navigateToLastPage}
              className={`last-page-nav icon-path-stroke-dark transform-icon pagination-nav ${
                isNextButtonDisabled ? 'disabled-el' : ''
              }`}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default CustomPagination;
