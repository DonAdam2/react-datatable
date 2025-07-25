import { DatatableRadioInputInterface } from '@/components/shared/datatable/datatableRadioInput/DatatableRadioInput.types';

const DatatableRadioInput = ({
  disabled,
  hidden,
  onSelectionChange,
  selectedData,
  dataKey,
  rowData,
  name,
  className,
}: DatatableRadioInputInterface) => {
  const disabledInput = disabled
    ? typeof disabled === 'boolean'
      ? disabled
      : disabled(rowData)
    : undefined;

  return (
    <>
      {!(hidden ? (typeof hidden === 'boolean' ? hidden : hidden(rowData)) : undefined) && (
        <input
          type="radio"
          name={name}
          disabled={disabledInput}
          value={rowData[dataKey].toString()}
          checked={rowData[dataKey].toString() === selectedData[dataKey].toString()}
          className={className}
          onChange={() => {
            onSelectionChange(rowData);
          }}
          data-test={`radio-input-${rowData[dataKey]}`}
        />
      )}
    </>
  );
};

export default DatatableRadioInput;
