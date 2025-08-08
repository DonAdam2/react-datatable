# Datatable Selection Functionality

This document provides a comprehensive guide on implementing and using the selection functionality in the React Datatable component.

## Table of Contents

- [Overview](#overview)
- [Selection Configuration](#selection-configuration)
- [Checkbox Selection](#checkbox-selection)
- [Radio Selection](#radio-selection)
- [Selection State Management](#selection-state-management)
- [Conditional Selection](#conditional-selection)
- [Custom Selection Behavior](#custom-selection-behavior)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)

## Overview

The Datatable component supports both checkbox (multiple) and radio (single) selection modes with full control over selection behavior. As of the latest version, the `selection` configuration has been moved from the `config` object to be a top-level prop alongside `records`, `columns`, and other main datatable properties.

### Key Features

- **Multiple Selection Modes**: Checkbox for multiple selections, radio for single selection
- **Conditional Logic**: Hide or disable selection for specific rows
- **State Management**: Control selected state externally
- **Select All Functionality**: Built-in select all/none for checkbox mode
- **Event Handling**: Callbacks for selection changes
- **TypeScript Support**: Fully typed selection configurations
- **Custom Styling**: Customizable selection input styling

## Selection Configuration

The selection functionality is configured through the `selection` prop:

```typescript
interface DatatableSelectionConfigInterface<T = Record<string, unknown>> {
  disabled?: boolean | BooleanFuncType<T>;
  hidden?: boolean | BooleanFuncType<T>;
  mode: SelectionModeType;
  onSelectionChange: (data: T | T[]) => void;
  selectedData: T | T[] | null | undefined;
  className?: string;
  dataKey: Extract<keyof T, string> | string;
  selectAllCheckbox?: {
    disabled?: boolean;
    hidden?: boolean;
  };
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `mode` | `'checkbox' \| 'radio'` | Yes | Selection mode - checkbox for multiple, radio for single |
| `onSelectionChange` | `function` | Yes | Callback function called when selection changes |
| `selectedData` | `T \| T[] \| null \| undefined` | Yes | Currently selected data |
| `dataKey` | `string` | Yes | Property key to identify unique records |
| `disabled` | `boolean \| function` | No | Disable selection for specific rows |
| `hidden` | `boolean \| function` | No | Hide selection input for specific rows |
| `className` | `string` | No | Custom CSS class for selection inputs |
| `selectAllCheckbox` | `object` | No | Configuration for select all checkbox |

## Checkbox Selection

Checkbox selection allows users to select multiple rows with a select all/none functionality in the header.

### Basic Checkbox Selection

```jsx
import { useState } from 'react';
import Datatable from './components/shared/datatable/Datatable';

const CheckboxSelectionExample = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const handleSelectionChange = (selectedRows) => {
    setSelectedEmployees(selectedRows);
    console.log('Selected employees:', selectedRows);
  };

  return (
    <div>
      <p>Selected: {selectedEmployees.length} employees</p>
      <Datatable
        columns={columns}
        records={data}
        selection={{
          mode: 'checkbox',
          onSelectionChange: handleSelectionChange,
          selectedData: selectedEmployees,
          dataKey: 'id',
        }}
      />
    </div>
  );
};
```

### Checkbox Selection with Pre-selected Data

```jsx
const [selectedEmployees, setSelectedEmployees] = useState([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
]);

<Datatable
  columns={columns}
  records={data}
  selection={{
    mode: 'checkbox',
    onSelectionChange: setSelectedEmployees,
    selectedData: selectedEmployees,
    dataKey: 'id',
  }}
/>
```

## Radio Selection

Radio selection allows users to select only one row at a time.

### Basic Radio Selection

```jsx
import { useState } from 'react';

const RadioSelectionExample = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSelectionChange = (selectedRow) => {
    setSelectedEmployee(selectedRow);
    console.log('Selected employee:', selectedRow);
  };

  return (
    <div>
      <p>
        Selected: {selectedEmployee ? selectedEmployee.name : 'None'}
      </p>
      <Datatable
        columns={columns}
        records={data}
        selection={{
          mode: 'radio',
          onSelectionChange: handleSelectionChange,
          selectedData: selectedEmployee,
          dataKey: 'id',
        }}
      />
    </div>
  );
};
```

### Radio Selection with Initial Selection

```jsx
const [selectedEmployee, setSelectedEmployee] = useState({
  id: 2,
  name: 'Jane Smith',
  email: 'jane@example.com',
});

<Datatable
  columns={columns}
  records={data}
  selection={{
    mode: 'radio',
    onSelectionChange: setSelectedEmployee,
    selectedData: selectedEmployee,
    dataKey: 'id',
  }}
/>
```

## Selection State Management

### Managing Selection State with Actions

```jsx
const SelectionWithActions = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleSelectAll = () => {
    setSelectedEmployees([...data]);
  };

  const handleClearSelection = () => {
    setSelectedEmployees([]);
  };

  const handleDeleteSelected = () => {
    if (selectedEmployees.length === 0) {
      alert('No employees selected');
      return;
    }
    
    const selectedIds = selectedEmployees.map(emp => emp.id);
    console.log('Deleting employees with IDs:', selectedIds);
    
    // Clear selection after action
    setSelectedEmployees([]);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleClearSelection}>Clear Selection</button>
        <button 
          onClick={handleDeleteSelected}
          disabled={selectedEmployees.length === 0}
        >
          Delete Selected ({selectedEmployees.length})
        </button>
      </div>
      
      <Datatable
        columns={columns}
        records={data}
        selection={{
          mode: 'checkbox',
          onSelectionChange: setSelectedEmployees,
          selectedData: selectedEmployees,
          dataKey: 'id',
        }}
      />
    </div>
  );
};
```

### Persistent Selection Across Data Updates

```jsx
const PersistentSelection = () => {
  const [data, setData] = useState(initialData);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const updateData = async () => {
    const newData = await fetchUpdatedData();
    setData(newData);
    
    // Keep only selections that still exist in new data
    const validSelections = selectedEmployees.filter(selected =>
      newData.some(item => item.id === selected.id)
    );
    setSelectedEmployees(validSelections);
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id',
      }}
    />
  );
};
```

## Conditional Selection

### Disabling Selection for Specific Rows

```jsx
const ConditionalDisabledSelection = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id',
        // Disable selection for inactive employees
        disabled: ({ getValue }) => getValue('status') === 'inactive',
      }}
    />
  );
};
```

### Hiding Selection for Specific Rows

```jsx
const ConditionalHiddenSelection = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id',
        // Hide selection for admin users
        hidden: ({ getValue }) => getValue('role') === 'admin',
      }}
    />
  );
};
```

### Complex Conditional Logic

```jsx
const ComplexConditionalSelection = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const isSelectionDisabled = ({ original, getValue }) => {
    const status = getValue('status');
    const role = getValue('role');
    const lastLoginDays = getValue('lastLoginDays');

    // Disable selection for:
    // - Inactive users
    // - Admin users
    // - Users who haven't logged in for more than 90 days
    return (
      status === 'inactive' ||
      role === 'admin' ||
      lastLoginDays > 90
    );
  };

  const isSelectionHidden = ({ getValue }) => {
    // Hide selection for deleted users
    return getValue('isDeleted') === true;
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id',
        disabled: isSelectionDisabled,
        hidden: isSelectionHidden,
      }}
    />
  );
};
```

## Custom Selection Behavior

### Custom Select All Configuration

```jsx
const CustomSelectAllExample = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id',
        selectAllCheckbox: {
          disabled: false, // Enable select all
          hidden: false,   // Show select all
        },
        // Only allow selection of active employees
        disabled: ({ getValue }) => getValue('status') !== 'active',
      }}
    />
  );
};
```

### Custom Selection Input Styling

```jsx
const StyledSelectionExample = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id',
        className: 'custom-selection-checkbox', // Custom CSS class
      }}
    />
  );
};
```

```css
/* Custom checkbox styling */
.custom-selection-checkbox {
  transform: scale(1.2);
  accent-color: #007bff;
}

.custom-selection-checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Examples

### Selection with Nested Data

```jsx
const NestedDataSelection = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const columns = [
    {
      accessorKey: 'user.profile.firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'user.profile.lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'department.name',
      header: 'Department',
    },
  ];

  const data = [
    {
      id: 1,
      user: {
        profile: { firstName: 'John', lastName: 'Doe' }
      },
      department: { name: 'Engineering' }
    },
    // ... more nested data
  ];

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedEmployees,
        dataKey: 'id', // Use top-level id for identification
        // Disable selection based on nested property
        disabled: ({ getValue }) => 
          getValue('department.name') === 'HR',
      }}
    />
  );
};
```

### Selection with Actions Integration

```jsx
const SelectionWithActionsExample = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const actions = [
    {
      label: 'Edit',
      onClick: (row) => editEmployee(row.id),
      icon: <EditIcon />,
    },
    {
      label: 'Delete',
      onClick: (row) => deleteEmployee(row.id),
      icon: <DeleteIcon />,
      // Hide delete action for selected rows to avoid confusion
      isHidden: (row) => selectedEmployees.some(emp => emp.id === row.id),
    },
  ];

  const bulkActions = selectedEmployees.length > 0 && (
    <div className="bulk-actions">
      <button onClick={() => bulkUpdateEmployees(selectedEmployees)}>
        Update Selected ({selectedEmployees.length})
      </button>
      <button onClick={() => bulkDeleteEmployees(selectedEmployees)}>
        Delete Selected ({selectedEmployees.length})
      </button>
    </div>
  );

  return (
    <div>
      {bulkActions}
      <Datatable
        columns={columns}
        records={data}
        actions={actions}
        selection={{
          mode: 'checkbox',
          onSelectionChange: setSelectedEmployees,
          selectedData: selectedEmployees,
          dataKey: 'id',
        }}
      />
    </div>
  );
};
```

### Selection with Pagination

```jsx
const SelectionWithPagination = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle selection change to maintain selections across pages
  const handleSelectionChange = (newSelections) => {
    // Remove current page selections
    const otherPageSelections = selectedEmployees.filter(emp =>
      !getCurrentPageData().some(pageEmp => pageEmp.id === emp.id)
    );
    
    // Add new selections
    setSelectedEmployees([...otherPageSelections, ...newSelections]);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getCurrentPageSelections = () => {
    const currentPageData = getCurrentPageData();
    return selectedEmployees.filter(emp =>
      currentPageData.some(pageEmp => pageEmp.id === emp.id)
    );
  };

  return (
    <div>
      <p>Total Selected: {selectedEmployees.length}</p>
      <Datatable
        columns={columns}
        records={getCurrentPageData()}
        selection={{
          mode: 'checkbox',
          onSelectionChange: handleSelectionChange,
          selectedData: getCurrentPageSelections(),
          dataKey: 'id',
        }}
        config={{
          pagination: {
            enablePagination: true,
            rowsDropdown: {
              rowsPerPage: itemsPerPage,
            },
          },
        }}
      />
    </div>
  );
};
```

## TypeScript Support

The selection functionality is fully typed for type safety:

```typescript
import { 
  DatatableSelectionConfigInterface,
  RowInfo,
  BooleanFuncType 
} from './components/shared/datatable/Datatable.types';

interface Employee {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'user' | 'admin';
}

const TypedSelectionExample = () => {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const handleSelectionChange = (data: Employee | Employee[]) => {
    // TypeScript knows this is Employee[] for checkbox mode
    setSelectedEmployees(data as Employee[]);
  };

  const isSelectionDisabled: BooleanFuncType<Employee> = ({ getValue }) => {
    // TypeScript provides proper typing for getValue
    return getValue('status') === 'inactive';
  };

  const selectionConfig: DatatableSelectionConfigInterface<Employee> = {
    mode: 'checkbox',
    onSelectionChange: handleSelectionChange,
    selectedData: selectedEmployees,
    dataKey: 'id',
    disabled: isSelectionDisabled,
  };

  return (
    <Datatable<Employee>
      columns={columns}
      records={employees}
      selection={selectionConfig}
    />
  );
};
```

## Best Practices

### 1. Choose the Right Selection Mode

- **Use Checkbox Selection** for bulk operations, multi-item actions
- **Use Radio Selection** for single item configuration, detail views

### 2. Provide Clear Selection Feedback

```jsx
const SelectionFeedback = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  return (
    <div>
      {selectedEmployees.length > 0 && (
        <div className="selection-summary">
          <span>{selectedEmployees.length} employees selected</span>
          <button onClick={() => setSelectedEmployees([])}>
            Clear Selection
          </button>
        </div>
      )}
      
      <Datatable
        columns={columns}
        records={data}
        selection={{
          mode: 'checkbox',
          onSelectionChange: setSelectedEmployees,
          selectedData: selectedEmployees,
          dataKey: 'id',
        }}
      />
    </div>
  );
};
```

### 3. Handle Large Datasets Efficiently

For large datasets, consider using ID-based selection:

```jsx
const EfficientSelection = () => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSelectionChange = (selectedRows) => {
    const ids = new Set(selectedRows.map(row => row.id));
    setSelectedIds(ids);
  };

  const getSelectedData = () => {
    return data.filter(item => selectedIds.has(item.id));
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: handleSelectionChange,
        selectedData: getSelectedData(),
        dataKey: 'id',
      }}
    />
  );
};
```

### 4. Implement Proper Error Handling

```jsx
const SafeSelection = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [error, setError] = useState('');

  const handleSelectionChange = (selectedRows) => {
    try {
      // Validate selection constraints
      if (selectedRows.length > 100) {
        throw new Error('Cannot select more than 100 items');
      }

      setSelectedEmployees(selectedRows);
      setError('');
    } catch (err) {
      setError(err.message);
      // Keep previous selection
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <Datatable
        columns={columns}
        records={data}
        selection={{
          mode: 'checkbox',
          onSelectionChange: handleSelectionChange,
          selectedData: selectedEmployees,
          dataKey: 'id',
        }}
      />
    </div>
  );
};
```

### 5. Accessibility Considerations

The datatable automatically handles:
- Keyboard navigation for selection
- ARIA labels for screen readers
- Focus management

Ensure your custom selection logic doesn't interfere with these features.

### 6. Performance Optimization

```jsx
import { useMemo, useCallback } from 'react';

const OptimizedSelection = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Memoize selection logic for better performance
  const isSelectionDisabled = useCallback(({ getValue }) => {
    return getValue('status') === 'inactive';
  }, []);

  // Memoize selected data computation
  const selectedData = useMemo(() => {
    return selectedEmployees;
  }, [selectedEmployees]);

  return (
    <Datatable
      columns={columns}
      records={data}
      selection={{
        mode: 'checkbox',
        onSelectionChange: setSelectedEmployees,
        selectedData: selectedData,
        dataKey: 'id',
        disabled: isSelectionDisabled,
      }}
    />
  );
};
```

### 7. Testing Selection Functionality

```jsx
import { render, screen, fireEvent } from '@testing-library/react';

describe('Datatable Selection', () => {
  test('should handle checkbox selection', () => {
    const mockOnSelectionChange = jest.fn();
    
    render(
      <Datatable
        columns={columns}
        records={mockData}
        selection={{
          mode: 'checkbox',
          onSelectionChange: mockOnSelectionChange,
          selectedData: [],
          dataKey: 'id',
        }}
      />
    );

    // Click on first row checkbox
    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip header
    fireEvent.click(firstCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith([mockData[0]]);
  });

  test('should disable selection based on condition', () => {
    render(
      <Datatable
        columns={columns}
        records={mockData}
        selection={{
          mode: 'checkbox',
          onSelectionChange: jest.fn(),
          selectedData: [],
          dataKey: 'id',
          disabled: ({ getValue }) => getValue('status') === 'inactive',
        }}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // Verify disabled state based on data
    expect(checkboxes[1]).toBeDisabled(); // First row if inactive
  });
});
```

---

## Migration from Previous Versions

If you're upgrading from a previous version where `selection` was part of the `config` object:

### Before (Old Structure)
```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    selection: {
      mode: 'checkbox',
      onSelectionChange: handleSelectionChange,
      selectedData: selectedEmployees,
      dataKey: 'id',
    },
    // other config options
  }}
/>
```

### After (New Structure)
```jsx
<Datatable
  columns={columns}
  records={data}
  selection={{
    mode: 'checkbox',
    onSelectionChange: handleSelectionChange,
    selectedData: selectedEmployees,
    dataKey: 'id',
  }}
  config={{
    // other config options (without selection)
  }}
/>
```

This change provides better organization and makes the selection functionality more discoverable alongside other main datatable features like `search`, `sort`, and `columnVisibility`.
