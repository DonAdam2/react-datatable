# Datatable Sorting Functionality

This document provides a comprehensive guide on implementing and using the sorting functionality in the React Datatable component.

## Table of Contents

- [Overview](#overview)
- [Sort Configuration](#sort-configuration)
- [Local Sorting](#local-sorting)
- [Remote Sorting](#remote-sorting)
- [Column Sort Configuration](#column-sort-configuration)
- [Custom Sort Icons](#custom-sort-icons)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)

## Overview

The Datatable component supports both local (client-side) and remote (server-side) sorting functionality. As of the latest version, the `sort` configuration has been moved from the `config` object to be a top-level prop alongside `records`, `columns`, and other main datatable properties.

### Key Features

- **Local Sorting**: Automatic client-side sorting of data
- **Remote Sorting**: Server-side sorting with custom handlers
- **Column-level Control**: Enable/disable sorting per column
- **Custom Sort Icons**: Customize sort indicators
- **Multiple Data Types**: Support for string, number, and custom sorting logic
- **TypeScript Support**: Fully typed sorting configurations

## Sort Configuration

The sorting functionality is configured through the `sort` prop:

```typescript
interface DatatableSortConfigInterface {
  isLocalSort?: boolean;
  onSorting?: (accessorKey: string, order: ColumnOrderType) => void | Promise<void>;
}
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isLocalSort` | `boolean` | `true` | Enable client-side sorting |
| `onSorting` | `function` | `undefined` | Callback function for sort events |

## Local Sorting

Local sorting is enabled by default and handles sorting on the client-side automatically.

### Basic Local Sorting

```jsx
import Datatable from './components/shared/datatable/Datatable';

const MyComponent = () => {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true, // Enable sorting for this column
    },
    {
      accessorKey: 'age',
      header: 'Age',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: false, // Disable sorting for this column
    },
  ];

  const data = [
    { name: 'John Doe', age: 30, email: 'john@example.com' },
    { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    // ... more data
  ];

  return (
    <Datatable
      columns={columns}
      records={data}
      sort={{
        isLocalSort: true, // Enable local sorting (default)
      }}
    />
  );
};
```

### Local Sorting with Custom Handler

You can also provide a custom handler even for local sorting to track sort events:

```jsx
const handleSort = (accessorKey, order) => {
  console.log(`Sorting by ${accessorKey} in ${order} order`);
  // Additional custom logic here
};

<Datatable
  columns={columns}
  records={data}
  sort={{
    isLocalSort: true,
    onSorting: handleSort,
  }}
/>
```

## Remote Sorting

Remote sorting delegates the sorting logic to the server, allowing you to handle large datasets efficiently.

### Basic Remote Sorting

```jsx
import { useState, useEffect } from 'react';

const RemoteSortingExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRemoteSort = async (accessorKey, order) => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sortColumn: accessorKey,
          sortOrder: order,
        }),
      });
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Sort error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      sort={{
        isLocalSort: false,
        onSorting: handleRemoteSort,
      }}
    />
  );
};
```

### Advanced Remote Sorting with State Management

```jsx
const AdvancedRemoteSorting = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortParams, setSortParams] = useState({
    column: 'name',
    order: 'asc',
  });

  const fetchSortedData = async (column, order) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy: column,
        sortOrder: order,
        page: '1',
        limit: '20',
      });

      const response = await fetch(`/api/employees?${params}`);
      const result = await response.json();
      
      setData(result.data);
      setSortParams({ column, order });
    } catch (error) {
      console.error('Remote sort failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (accessorKey, order) => {
    await fetchSortedData(accessorKey, order);
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      sort={{
        isLocalSort: false,
        onSorting: handleSort,
      }}
    />
  );
};
```

## Column Sort Configuration

Configure sorting behavior at the column level:

```jsx
const columns = [
  {
    accessorKey: 'name',
    header: 'Full Name',
    enableSorting: true, // Enable sorting
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    enableSorting: true,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableSorting: false, // Disable sorting for action columns
  },
  {
    accessorKey: 'created_at',
    header: 'Created Date',
    enableSorting: true,
    // Custom cell renderer for dates
    cell: (row) => new Date(row.created_at).toLocaleDateString(),
  },
];
```

## Custom Sort Icons

Customize the sort indicators using the UI configuration:

```jsx
import FilterIcon from './icons/FilterIcon';
import AscendingIcon from './icons/AscendingIcon';
import DescendingIcon from './icons/DescendingIcon';

<Datatable
  columns={columns}
  records={data}
  sort={{
    isLocalSort: true,
  }}
  config={{
    ui: {
      sortIcon: <FilterIcon />,           // Default sort icon
      ascendingSortIcon: <AscendingIcon />, // Ascending sort icon
      descendingSortIcon: <DescendingIcon />, // Descending sort icon
    },
  }}
/>
```

## Examples

### Mixed Sortable and Non-Sortable Columns

```jsx
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
    width: 80,
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    enableSorting: false, // Images shouldn't be sortable
    cell: (row) => <img src={row.avatar} alt="Avatar" />,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    enableSorting: true,
    cell: (row) => `$${row.salary.toLocaleString()}`,
  },
];
```

### Sorting with Nested Data

```jsx
const columns = [
  {
    accessorKey: 'user.profile.firstName',
    header: 'First Name',
    enableSorting: true,
  },
  {
    accessorKey: 'user.profile.lastName',
    header: 'Last Name',
    enableSorting: true,
  },
  {
    accessorKey: 'department.name',
    header: 'Department',
    enableSorting: true,
  },
];

// The datatable automatically handles nested property sorting
```

### Sorting with Custom Data Types

For complex sorting logic, use remote sorting with custom handlers:

```jsx
const handleCustomSort = async (accessorKey, order) => {
  let sortedData;

  switch (accessorKey) {
    case 'priority':
      // Custom priority sorting: High > Medium > Low
      sortedData = data.sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 };
        const comparison = priorities[a.priority] - priorities[b.priority];
        return order === 'asc' ? comparison : -comparison;
      });
      break;
    
    case 'status':
      // Custom status sorting
      sortedData = data.sort((a, b) => {
        const statuses = { active: 3, pending: 2, inactive: 1 };
        const comparison = statuses[a.status] - statuses[b.status];
        return order === 'asc' ? comparison : -comparison;
      });
      break;
    
    default:
      // Standard sorting for other columns
      sortedData = data.sort((a, b) => {
        const valueA = a[accessorKey];
        const valueB = b[accessorKey];
        if (order === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
  }

  setData([...sortedData]);
};
```

## TypeScript Support

The sorting functionality is fully typed:

```typescript
import { 
  ColumnOrderType, 
  DatatableSortConfigInterface 
} from './components/shared/datatable/Datatable.types';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

const handleSort = (accessorKey: string, order: ColumnOrderType) => {
  // accessorKey is string
  // order is 'asc' | 'desc'
  console.log(`Sorting ${accessorKey} in ${order} order`);
};

const sortConfig: DatatableSortConfigInterface = {
  isLocalSort: false,
  onSorting: handleSort,
};

<Datatable<Employee>
  columns={columns}
  records={employees}
  sort={sortConfig}
/>
```

## Best Practices

### 1. Choose the Right Sorting Strategy

- **Use Local Sorting** for small to medium datasets (< 1000 records)
- **Use Remote Sorting** for large datasets or when you need server-side filtering/pagination

### 2. Provide User Feedback

```jsx
const [sortStatus, setSortStatus] = useState('');

const handleSort = async (accessorKey, order) => {
  setSortStatus(`Sorting by ${accessorKey}...`);
  try {
    await fetchSortedData(accessorKey, order);
    setSortStatus('');
  } catch (error) {
    setSortStatus('Sort failed');
  }
};
```

### 3. Handle Sorting State

Keep track of current sort state for better UX:

```jsx
const [currentSort, setCurrentSort] = useState({
  column: null,
  order: 'asc',
});

const handleSort = async (accessorKey, order) => {
  setCurrentSort({ column: accessorKey, order });
  await fetchSortedData(accessorKey, order);
};
```

### 4. Optimize Performance

For local sorting with large datasets, consider using useMemo:

```jsx
const sortedData = useMemo(() => {
  if (!sortColumn) return data;
  
  return [...data].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
}, [data, sortColumn, sortOrder]);
```

### 5. Error Handling

Always implement proper error handling for remote sorting:

```jsx
const handleSort = async (accessorKey, order) => {
  try {
    setLoading(true);
    await fetchSortedData(accessorKey, order);
  } catch (error) {
    console.error('Sorting failed:', error);
    // Show user-friendly error message
    setError('Failed to sort data. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### 6. Accessibility

The datatable automatically handles keyboard navigation for sorting. Ensure your custom sort icons have proper ARIA labels if needed.

### 7. Testing Sorting Functionality

```jsx
// Example test case
test('should sort data locally when isLocalSort is true', () => {
  const mockData = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ];

  render(
    <Datatable
      columns={columns}
      records={mockData}
      sort={{ isLocalSort: true }}
    />
  );

  // Click on name column header
  fireEvent.click(screen.getByText('Name'));
  
  // Verify sorted order
  expect(screen.getByText('Jane')).toBeInTheDocument();
});
```

---

## Migration from Previous Versions

If you're upgrading from a previous version where `sort` was part of the `config` object:

### Before (Old Structure)
```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    sort: {
      isLocalSort: false,
      onSorting: handleSort,
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
  sort={{
    isLocalSort: false,
    onSorting: handleSort,
  }}
  config={{
    // other config options (without sort)
  }}
/>
```

This change provides better organization and makes the sorting functionality more discoverable alongside other main datatable features.
