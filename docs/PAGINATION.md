# Pagination Guide

This guide covers all pagination features and configurations available in the React Datatable component.

## Table of Contents
- [Overview](#overview)
- [Basic Pagination](#basic-pagination)
- [Local Pagination](#local-pagination)
- [Remote Pagination](#remote-pagination)
- [Custom Pagination](#custom-pagination)
- [Disabling Pagination](#disabling-pagination)
- [Deep Linking](#deep-linking)
- [Configuration Options](#configuration-options)
- [TypeScript Interfaces](#typescript-interfaces)
- [Examples](#examples)

## Overview

The React Datatable component supports three types of pagination:

1. **Local Pagination**: Client-side pagination with automatic data slicing
2. **Remote Pagination**: Server-side pagination with API integration
3. **Custom Pagination**: Use your own pagination component

All pagination configurations are now provided through the top-level `pagination` prop, not through the `config` object.

## Basic Pagination

By default, pagination is enabled with standard settings. The component automatically uses local pagination for client-side data processing.

```jsx
import Datatable from './components/shared/datatable/Datatable';

const BasicExample = () => {
  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ];

  const data = [
    // Your data array
  ];

  return (
    <Datatable
      columns={columns}
      records={data}
      // Pagination is enabled by default with 10 rows per page
    />
  );
};
```

## Local Pagination

Local pagination handles all pagination logic on the client side, making it perfect for smaller datasets or when you want to load all data at once.

```jsx
const LocalPaginationExample = () => {
  return (
    <Datatable
      columns={columns}
      records={data}
      pagination={{
        enablePagination: true,
        rowsDropdown: {
          enableRowsDropdown: true,
          rowsPerPage: 20, // Default rows per page
          optionsList: [
            { value: 10, displayValue: '10 rows' },
            { value: 20, displayValue: '20 rows' },
            { value: 50, displayValue: '50 rows' },
          ],
        },
        rangeSeparatorLabel: 'out of', // Changes "1 of 10" to "1 out of 10"
      }}
    />
  );
};
```

### Customizing Pagination Range Separator

You can customize the text that appears between page numbers in the pagination display by using the `rangeSeparatorLabel` property:

```jsx
const CustomSeparatorExample = () => {
  return (
    <Datatable
      columns={columns}
      records={data}
      pagination={{
        rangeSeparatorLabel: 'out of', // Default is 'of'
        // Results in: "Showing 1-10 out of 100"
      }}
    />
  );
};
```

Common separator values:
- `'of'` (default) → "1 of 10 pages"
- `'out of'` → "1 out of 10 pages"  
- `'/'` → "1 / 10 pages"
- `'|'` → "1 | 10 pages"

## Remote Pagination

Remote pagination is ideal for large datasets where you want to fetch data from the server based on the current page and page size.

```jsx
import { useState, useEffect } from 'react';

const RemotePaginationExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = async (page, rowsPerPage) => {
    setLoading(true);
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          page, 
          rowsPerPage,
        }),
      });
      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationUpdate = async (currentPage, rowsPerPageNum) => {
    await fetchData(currentPage, rowsPerPageNum);
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      pagination={{
        remoteControl: {
          onPaginationDataUpdate: handlePaginationUpdate,
          totalRecords: totalRecords,
        },
        rowsDropdown: {
          rowsPerPage: 25,
          optionsList: [
            { value: 10, displayValue: '10 per page' },
            { value: 25, displayValue: '25 per page' },
            { value: 50, displayValue: '50 per page' },
          ],
        },
      }}
    />
  );
};
```

## Custom Pagination

You can provide your own pagination component for complete control over the pagination UI and behavior.

```jsx
import CustomPagination from './CustomPagination';
import usePagination from './hooks/usePagination';

const CustomPaginationExample = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  
  const paginationData = usePagination({
    contentPerPage: 15,
    count: totalRecords,
  });

  const { firstContentIndex, lastContentIndex, navigateToFirstPage } = paginationData;

  // Update total records when data changes
  useEffect(() => {
    setTotalRecords(data.length);
  }, [data.length]);

  // Required for search functionality with custom pagination
  const handleUpdateFilteredRecordsCount = useCallback((count) => {
    setTotalRecords(count);
  }, []);

  return (
    <Datatable
      columns={columns}
      records={data}
      search={{
        show: true,
        onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount,
      }}
      pagination={{
        firstContentIndex,
        lastContentIndex,
        resetPagination: () => navigateToFirstPage(),
        paginationComponent: <CustomPagination {...paginationData} />,
      }}
    />
  );
};
```

### ⚠️ Important: Custom Pagination with Search

When using custom pagination with search functionality, you **must** provide the `onUpdateFilteredRecordsCount` callback in your search configuration. This ensures your pagination component receives the correct total count when data is filtered.

## Disabling Pagination

You can completely disable pagination to show all records at once.

```jsx
const NoPaginationExample = () => {
  return (
    <Datatable
      columns={columns}
      records={data}
      pagination={{
        enablePagination: false,
      }}
    />
  );
};
```

## Deep Linking

Enable URL-based pagination state management to allow users to bookmark and share specific pages.

```jsx
const DeepLinkingExample = () => {
  return (
    <Datatable
      columns={columns}
      records={data}
      pagination={{
        remoteControl: {
          onPaginationDataUpdate: handlePaginationUpdate,
          totalRecords: totalRecords,
        },
        deepLinking: {
          pageNumKey: 'page',     // URL param for page number
          pageSizeKey: 'pageSize', // URL param for page size
        },
      }}
    />
  );
};
```

With deep linking enabled:
- Current page and page size are reflected in the URL
- Users can navigate directly to specific pages via URL
- Browser back/forward buttons work correctly
- Page state persists on refresh

## Configuration Options

### LocalControlledPaginationInterface

```typescript
interface LocalControlledPaginationInterface {
  enablePagination?: boolean;
  rowsDropdown?: {
    enableRowsDropdown?: boolean;
    rowsPerPage?: number;
    optionsList?: DatatableRowsDropdownOption[];
  };
  deepLinking?: DeepLinkingConfig;
  rangeSeparatorLabel?: string;
}
```

### RemoteControlledPaginationInterface

```typescript
interface RemoteControlledPaginationInterface {
  enablePagination?: boolean;
  rowsDropdown?: {
    enableRowsDropdown?: boolean;
    rowsPerPage?: number;
    optionsList?: DatatableRowsDropdownOption[];
  };
  remoteControl: {
    onPaginationDataUpdate: (currentPage: number, rowsPerPageNum: number) => void | Promise<void>;
    totalRecords: number;
  };
  deepLinking?: DeepLinkingConfig;
  rangeSeparatorLabel?: string;
}
```

### RootPaginationInterface (Custom Pagination)

```typescript
interface RootPaginationInterface {
  enablePagination?: boolean;
  paginationComponent?: ReactNode;
  resetPagination?: () => { activePage: number; rowsPerPageNum: number } | void | Promise<void>;
  firstContentIndex?: number;
  lastContentIndex?: number;
  rangeSeparatorLabel?: string;
}
```

### DatatableRowsDropdownOption

```typescript
interface DatatableRowsDropdownOption {
  value: number;
  displayValue: string;
}
```

## TypeScript Interfaces

The pagination prop accepts a union type of all pagination configurations:

```typescript
type DatatablePaginationConfig =
  | RootPaginationInterface
  | LocalControlledPaginationInterface
  | RemoteControlledPaginationInterface;
```

## Examples

### Complete Local Pagination Setup

```jsx
const CompleteLocalExample = () => {
  const datatableRef = useRef(null);

  const resetPagination = () => {
    datatableRef.current?.resetPagination();
  };

  return (
    <>
      <button onClick={resetPagination}>Reset to First Page</button>
      <Datatable
        ref={datatableRef}
        columns={columns}
        records={data}
        search={{ show: true }}
        pagination={{
          enablePagination: true,
          rowsDropdown: {
            enableRowsDropdown: true,
            rowsPerPage: 15,
            optionsList: [
              { value: 5, displayValue: '5 rows' },
              { value: 15, displayValue: '15 rows' },
              { value: 30, displayValue: '30 rows' },
              { value: 50, displayValue: '50 rows' },
            ],
          },
        }}
        pagination={{
          enablePagination: true,
          rangeSeparatorLabel: 'out of',
          rowsDropdown: {
            enableRowsDropdown: true,
            rowsPerPage: 15,
            optionsList: [
              { value: 5, displayValue: '5 rows' },
              { value: 15, displayValue: '15 rows' },
              { value: 30, displayValue: '30 rows' },
              { value: 50, displayValue: '50 rows' },
            ],
          },
        }}
      />
    </>
  );
};
```

### Complete Remote Pagination Setup

```jsx
const CompleteRemoteExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [params, setParams] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    searchTerm: '',
    sortField: 'name',
    sortOrder: 'asc',
  });

  const fetchData = async (newParams = params) => {
    setLoading(true);
    try {
      const response = await api.getData(newParams);
      setData(response.data);
      setTotalRecords(response.total);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationUpdate = async (currentPage, rowsPerPageNum) => {
    const newParams = { 
      ...params, 
      currentPage, 
      itemsPerPage: rowsPerPageNum 
    };
    setParams(newParams);
    await fetchData(newParams);
  };

  const handleSearch = async (searchTerm) => {
    const newParams = { 
      ...params, 
      searchTerm, 
      currentPage: 1 // Reset to first page
    };
    setParams(newParams);
    await fetchData(newParams);
  };

  const handleSort = async (sortField, sortOrder) => {
    const newParams = { 
      ...params, 
      sortField, 
      sortOrder 
    };
    setParams(newParams);
    await fetchData(newParams);
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      search={{
        onSearch: handleSearch,
        isLocalSearch: false,
      }}
      sort={{
        onSorting: handleSort,
        isLocalSort: false,
      }}
      pagination={{
        remoteControl: {
          onPaginationDataUpdate: handlePaginationUpdate,
          totalRecords: totalRecords,
        },
        rowsDropdown: {
          rowsPerPage: 20,
          optionsList: [
            { value: 10, displayValue: '10 per page' },
            { value: 20, displayValue: '20 per page' },
            { value: 50, displayValue: '50 per page' },
            { value: 100, displayValue: '100 per page' },
          ],
        },
        deepLinking: {
          pageNumKey: 'page',
          pageSizeKey: 'size',
        },
      }}
    />
  );
};
```

## Migration Guide

If you're migrating from the old structure where pagination was in the `config` object:

### Before (Old Structure)
```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    pagination: {
      enablePagination: true,
      remoteControl: {
        onPaginationDataUpdate: handleUpdate,
        totalRecords: total,
      },
    },
  }}
/>
```

### After (New Structure)
```jsx
<Datatable
  columns={columns}
  records={data}
  pagination={{
    enablePagination: true,
    remoteControl: {
      onPaginationDataUpdate: handleUpdate,
      totalRecords: total,
    },
  }}
/>
```

The configuration options remain exactly the same—only the location has changed from `config.pagination` to the top-level `pagination` prop.
