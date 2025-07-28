import { useMemo } from 'react';
import { DatatableColumnVisibilityInterface } from './DatatableColumnVisibility.types';
import DropdownComponent from '@/components/shared/dropdown/Dropdown';
import { OptionInterface } from '@/components/shared/dropdown/Dropdown.types';
import DropdownContextProvider from '@/components/shared/dropdown/dropdownContextProvider/DropdownContextProvider';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import Button from '@/components/shared/button/Button';

const DatatableColumnVisibility = <T = Record<string, unknown>,>({
  columns,
  visibleColumns,
  onToggleColumn,
  trigger,
}: DatatableColumnVisibilityInterface<T>) => {
  const hideableColumns = useMemo(() => {
    return columns.filter(
      (column) => column.hideable !== false && typeof column.header === 'string' && column.header
    );
  }, [columns]);

  // Convert columns to dropdown options
  const dropdownOptions: OptionInterface[] = useMemo(() => {
    return hideableColumns.map((column) => {
      const columnKey = String(column.accessorKey);
      return {
        value: columnKey,
        displayValue: String(column.header || columnKey),
      };
    });
  }, [hideableColumns]);

  // Get currently selected (visible) column keys
  const selectedColumnKeys = useMemo(() => {
    return Object.keys(visibleColumns).filter((key) => visibleColumns[key] !== false);
  }, [visibleColumns]);

  if (hideableColumns.length === 0) {
    return null;
  }

  // Handle dropdown value change
  const handleDropdownChange = (value: string | string[]) => {
    const selectedKeys = Array.isArray(value) ? value : [value];
    const allColumnKeys = hideableColumns.map((col) => String(col.accessorKey));

    // Update visibility for all hideable columns
    allColumnKeys.forEach((key) => {
      const shouldBeVisible = selectedKeys.includes(key);
      const currentlyVisible = visibleColumns[key] !== false;

      if (shouldBeVisible !== currentlyVisible) {
        onToggleColumn(key);
      }
    });
  };

  return (
    <DropdownContextProvider>
      <DropdownComponent
        wrapper={{
          dataTest: 'column-visibility-dropdown',
        }}
        header={{
          isBorder: true,
          trigger: (
            <Button
              {...trigger}
              label={trigger?.label ?? 'Columns'}
              icon={trigger?.icon ?? <ChevronDownIcon />}
              iconPosition={trigger?.iconPosition ?? 'right'}
              type={trigger?.type ?? 'button'}
              variant={trigger?.variant ?? 'light'}
            />
          ),
          controlledDropdown: {
            isCheckboxMultiSelect: true,
            value: selectedColumnKeys,
            onChangeHandler: handleDropdownChange,
            staticHeadLabel: trigger?.label ?? 'Columns',
            arrowIcon: <ChevronDownIcon />,
          },
        }}
        body={{
          options: dropdownOptions,
        }}
      />
    </DropdownContextProvider>
  );
};

export default DatatableColumnVisibility;
