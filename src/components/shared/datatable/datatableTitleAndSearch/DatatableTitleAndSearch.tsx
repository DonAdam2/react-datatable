import { DatatableTitleAndSearchInterface } from '@/components/shared/datatable/datatableTitleAndSearch/DatatableTitleAndSearch.types';
import DatatableTitle from '@/components/shared/datatable/datatableTitle/DatatableTitle';
import DatatableSearch from '@/components/shared/datatable/datatableSearch/DatatableSearch';

const DatatableTitleAndSearch = ({
  title,
  titlePosition,
  buttons,
  buttonsPosition,
  titleStyles,
  search,
}: DatatableTitleAndSearchInterface) => {
  const isSearchPositionStart = search && search.searchPosition === 'start';

  return (
    <>
      {(title || buttons || search) && (
        <div
          className="datatable-search-title-wrapper"
          style={{
            flexDirection: isSearchPositionStart ? 'row-reverse' : 'row',
          }}
        >
          {(title || buttons) && (
            <DatatableTitle
              title={title}
              titleStyles={titleStyles}
              titlePosition={titlePosition}
              buttons={buttons}
              buttonsPosition={buttonsPosition}
              isRemovePadding
              isInSearchRow
            />
          )}
          <div style={{ flex: title || buttons ? '1 1 10%' : '1' }} />
          {search?.show && <DatatableSearch {...search} />}
        </div>
      )}
    </>
  );
};

export default DatatableTitleAndSearch;
