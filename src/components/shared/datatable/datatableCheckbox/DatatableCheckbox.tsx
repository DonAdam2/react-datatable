import { DatatableRadioInputInterface } from '@/components/shared/datatable/datatableRadioInput/DatatableRadioInput.types';
import cloneDeep from 'lodash/cloneDeep';

const DatatableCheckbox = ({
  disabled,
  hidden,
  onSelectionChange,
  selectedData,
  dataKey,
  rowData,
  name,
  className,
  isSelectAllRecords,
  setIsSelectAllRecords,
  candidateRecordsToSelectAll,
}: DatatableRadioInputInterface) => {
  const disabledInput = disabled
      ? typeof disabled === 'boolean'
        ? disabled
        : disabled(rowData)
      : undefined,
    isChecked = selectedData.some(
      (item: any) => item[dataKey].toString() === rowData[dataKey].toString()
    );

  return (
    <>
      {!(hidden ? (typeof hidden === 'boolean' ? hidden : hidden(rowData)) : undefined) && (
        <input
          type="checkbox"
          name={name}
          disabled={disabledInput}
          checked={isChecked}
          className={className}
          onChange={() => {
            const clonedSelectedData = cloneDeep(selectedData);
            // Check if the selected person is already in the array
            const isSelected = clonedSelectedData.some(
              (el: any) => el[dataKey] === rowData[dataKey]
            );
            let newSelections = [];

            if (isSelected) {
              // If item is selected, remove it
              newSelections = clonedSelectedData.filter(
                (el: any) => el[dataKey] !== rowData[dataKey]
              );
            } else {
              // If the item is not selected, add it
              newSelections = [...clonedSelectedData, rowData];
            }

            //if isSelectAllRecords is selected => unselect it
            if (isSelectAllRecords && setIsSelectAllRecords) {
              setIsSelectAllRecords(false);
            }

            //get list of unselected records from candidateRecordsToSelectAll based on newSelections
            const unSelectedRecords = candidateRecordsToSelectAll.filter(
              (candidate: any) =>
                !newSelections.some((record: any) => candidate[dataKey] === record[dataKey])
            );

            /* if isSelectAllRecords=false, unSelectedRecords array is empty and
             * candidateRecordsToSelectAll.length equal to newSelections.length
             * set isSelectAllRecords to true
             * else set selectedData to newSelections */
            if (
              setIsSelectAllRecords &&
              !isSelectAllRecords &&
              !unSelectedRecords.length &&
              candidateRecordsToSelectAll.length === newSelections.length
            ) {
              /* we are not using onSelectionChange because once we set isSelectAllRecords to true
               * useEffect in DatatableHeader will run to select all candidate records */
              setIsSelectAllRecords(true);
            } else {
              onSelectionChange(newSelections);
            }
          }}
          data-test={`checkbox-input-${rowData[dataKey]}`}
        />
      )}
    </>
  );
};

export default DatatableCheckbox;
