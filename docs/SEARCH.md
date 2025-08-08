# Datatable Search Functionality

This document provides a comprehensive guide on implementing and using the search functionality in the React Datatable component.

## Table of Contents

- [Overview](#overview)
- [Search Configuration](#search-configuration)
- [Local Search](#local-search)
- [Remote Search](#remote-search)
- [Search Positioning](#search-positioning)
- [Custom Search Styling](#custom-search-styling)
- [Search with Pagination](#search-with-pagination)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)

## Overview

The Datatable component provides flexible search functionality that can work with both local (client-side) and remote (server-side) data filtering. As of the latest version, the `search` configuration has been moved from the `config` object to be a top-level prop alongside `records`, `columns`, and other main datatable properties.

### Key Features

- **Local Search**: Automatic client-side filtering of data
- **Remote Search**: Server-side search with custom handlers
- **Flexible Positioning**: Position search input at start or end
- **Full-width Support**: Make search input span the full width
- **Custom Placeholders**: Customize search input placeholder text
- **Pagination Integration**: Automatic pagination reset on search
- **TypeScript Support**: Fully typed search configurations

## Search Configuration

The search functionality is configured through the `search` prop:

```typescript
interface DatatableSearchConfigInterface {
  show?: boolean;
  onSearch?: (key: string) => void | Promise<void>;
  isLocalSearch?: boolean;
  isFullWidth?: boolean;
  placeholder?: string;
  searchDataTest?: string;
  searchPosition?: TitlePositionType;
  onUpdateFilteredRecordsCount?: (count: number) => void;
}
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `show` | `boolean` | `true` | Show/hide search functionality |
| `onSearch` | `function` | `undefined` | Search handler function |
| `isLocalSearch` | `boolean` | `true` | Enable client-side search |
| `isFullWidth` | `boolean` | `false` | Make search input full width |
| `placeholder` | `string` | `'Search...'` | Search input placeholder |
| `searchDataTest` | `string` | `undefined` | Data test attribute for search |
| `searchPosition` | `'start' \| 'end'` | `'end'` | Position of search input |
| `onUpdateFilteredRecordsCount` | `function` | `undefined` | Callback for filtered record count updates |

## Local Search

Local search is enabled by default and performs client-side filtering across all visible columns.

### Basic Local Search

```jsx
import Datatable from './components/shared/datatable/Datatable';

const MyComponent = () => {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
  ];

  const data = [
    { name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
    { name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
    // ... more data
  ];

  return (
    <Datatable
      columns={columns}
      records={data}
      search={{
        show: true,
        isLocalSearch: true,
        placeholder: 'Search employees...',
      }}
    />
  );
};
```

### Local Search with Custom Handler

Track search events while maintaining local filtering:

```jsx
const handleSearchEvent = (searchTerm) => {
  console.log(`Searching for: ${searchTerm}`);
  // Track analytics, save to localStorage, etc.
};

<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    isLocalSearch: true,
    onSearch: handleSearchEvent,
    placeholder: 'Type to search...',
  }}
/>
```

### Local Search with Pagination Integration

When using local search with pagination, the component automatically handles filtered record counts:

```jsx
const [filteredCount, setFilteredCount] = useState(data.length);

<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    isLocalSearch: true,
    onUpdateFilteredRecordsCount: setFilteredCount,
  }}
/>

<p>Showing {filteredCount} of {data.length} records</p>
```

## Remote Search

Remote search delegates the filtering logic to the server, allowing you to search through large datasets efficiently.

### Basic Remote Search

```jsx
import { useState, useEffect } from 'react';

const RemoteSearchExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRemoteSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          page: 1,
          limit: 20,
        }),
      });
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      search={{
        show: true,
        isLocalSearch: false,
        onSearch: handleRemoteSearch,
        placeholder: 'Search employees...',
      }}
    />
  );
};
```

### Debounced Remote Search

Implement debouncing to avoid excessive API calls:

```jsx
import { useCallback } from 'react';
import { debounce } from 'lodash';

const DebouncedRemoteSearch = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // Handle empty search - load all data or clear results
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/employees?search=${encodeURIComponent(searchTerm)}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce(performSearch, 300),
    []
  );

  const handleSearch = (searchTerm) => {
    debouncedSearch(searchTerm);
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      search={{
        show: true,
        isLocalSearch: false,
        onSearch: handleSearch,
        placeholder: 'Type to search (debounced)...',
      }}
    />
  );
};
```

### Remote Search with Advanced Filtering

```jsx
const AdvancedRemoteSearch = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    filters: {
      department: '',
      status: 'active',
    },
  });

  const handleSearch = async (searchTerm) => {
    const newParams = {
      ...searchParams,
      query: searchTerm,
    };
    
    setSearchParams(newParams);
    await fetchFilteredData(newParams);
  };

  const fetchFilteredData = async (params) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: params.query,
        department: params.filters.department,
        status: params.filters.status,
        page: '1',
        limit: '20',
      });

      const response = await fetch(`/api/employees?${queryParams}`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      search={{
        show: true,
        isLocalSearch: false,
        onSearch: handleSearch,
        placeholder: 'Search with advanced filters...',
      }}
    />
  );
};
```

## Search Positioning

Control where the search input appears in the datatable layout:

### Search at End (Default)

```jsx
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    searchPosition: 'end', // Default position
  }}
/>
```

### Search at Start

```jsx
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    searchPosition: 'start',
  }}
/>
```

### Full-width Search

```jsx
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    isFullWidth: true,
    placeholder: 'Search across all columns...',
  }}
/>
```

### Search in Different Locations

You can position search in different locations relative to the title:

```jsx
<Datatable
  title={{
    titleLabel: 'Employee Management',
    titleLocation: 'titleRow', // or 'searchRow'
  }}
  columns={columns}
  records={data}
  search={{
    show: true,
    searchPosition: 'end',
    isFullWidth: false,
  }}
/>
```

## Custom Search Styling

### Custom Placeholder and Styling

```jsx
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    placeholder: '🔍 Search by name, email, or department...',
    searchDataTest: 'employee-search-input',
  }}
  config={{
    ui: {
      tableWrapperClassName: 'custom-datatable-wrapper',
    },
  }}
/>
```

### Conditional Search Display

```jsx
const [showSearch, setShowSearch] = useState(true);

<>
  <button onClick={() => setShowSearch(!showSearch)}>
    {showSearch ? 'Hide' : 'Show'} Search
  </button>
  
  <Datatable
    columns={columns}
    records={data}
    search={{
      show: showSearch,
      placeholder: showSearch ? 'Search...' : '',
    }}
  />
</>
```

## Search with Pagination

### Important: Custom Pagination Requirements

When using **custom pagination** (providing your own `paginationComponent` in the config), you **must** include the `onUpdateFilteredRecordsCount` prop in your search configuration. This prop allows the datatable to notify your custom pagination component about changes in the filtered record count.

```jsx
// ✅ REQUIRED when using custom pagination
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    isLocalSearch: true,
    onUpdateFilteredRecordsCount: (filteredCount) => {
      // Update your custom pagination component with the new count
      setTotalRecords(filteredCount);
    },
  }}
  config={{
    pagination: {
      paginationComponent: <CustomPagination totalRecords={totalRecords} />,
      // ... other pagination config
    },
  }}
/>
```

**Why is this needed?**
- When users search and filter data, the total number of records changes
- Your custom pagination component needs to know the new filtered count to display correct page numbers and navigation
- Without this prop, your pagination will show incorrect totals and may break navigation

**Note:** This prop is **not required** when using the built-in pagination component, as it automatically handles filtered record counts internally.

#### Complete Custom Pagination Example

Here's a complete example showing how to properly implement custom pagination with search:

```jsx
import { useState, useEffect } from 'react';
import usePagination from '@/hooks/usePagination';
import CustomPagination from '@/components/customPagination/CustomPagination';

const CustomPaginationWithSearch = () => {
  const [data, setData] = useState(largeDataset);
  const [totalRecords, setTotalRecords] = useState(largeDataset.length);
  
  const paginationData = usePagination({
    contentPerPage: 10,
    count: totalRecords, // This will be updated by onUpdateFilteredRecordsCount
  });

  const { firstContentIndex, lastContentIndex, navigateToFirstPage } = paginationData;

  // ✅ This callback is REQUIRED for custom pagination
  const handleUpdateFilteredRecordsCount = (filteredCount) => {
    setTotalRecords(filteredCount);
    // Optionally reset to first page when search changes results
    if (filteredCount > 0 && filteredCount !== totalRecords) {
      navigateToFirstPage();
    }
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      search={{
        show: true,
        isLocalSearch: true,
        placeholder: 'Search employees...',
        // ✅ REQUIRED: This prop updates totalRecords when search filters data
        onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount,
      }}
      config={{
        pagination: {
          // Custom pagination requires manual handling of filtered counts
          firstContentIndex,
          lastContentIndex,
          resetPagination: () => navigateToFirstPage(),
          paginationComponent: <CustomPagination {...paginationData} />,
        },
      }}
    />
  );
};
```

#### What Happens Without This Prop?

```jsx
// ❌ INCORRECT: Missing onUpdateFilteredRecordsCount
<Datatable
  search={{ show: true, isLocalSearch: true }}
  config={{
    pagination: {
      paginationComponent: <CustomPagination totalRecords={1000} />, // Wrong!
    },
  }}
/>

// Problems this causes:
// 1. User searches "John" → only 5 results found
// 2. Pagination still shows "Page 1 of 100" (based on 1000 total)
// 3. User clicks "Next Page" → shows empty page
// 4. Navigation becomes broken and confusing
```

### Local Search with Automatic Pagination Reset

```jsx
const LocalSearchWithPagination = () => {
  const [data] = useState(largeDataset); // Large dataset

  return (
    <Datatable
      columns={columns}
      records={data}
      search={{
        show: true,
        isLocalSearch: true,
        placeholder: 'Search employees...',
      }}
      config={{
        pagination: {
          enablePagination: true,
          rowsDropdown: {
            rowsPerPage: 10,
          },
        },
      }}
    />
  );
};
```

### Remote Search with Pagination

```jsx
const RemoteSearchWithPagination = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (search = '', page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/employees?${params}`);
      const result = await response.json();
      
      setData(result.data);
      setTotalRecords(result.total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    await fetchData(term, 1); // Reset to first page on search
  };

  const handlePagination = async (page, limit) => {
    await fetchData(searchTerm, page, limit);
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      isLoading={loading}
      search={{
        show: true,
        isLocalSearch: false,
        onSearch: handleSearch,
        placeholder: 'Search employees...',
      }}
      config={{
        pagination: {
          remoteControl: {
            onPaginationDataUpdate: handlePagination,
            totalRecords,
          },
        },
      }}
    />
  );
};
```

## Examples

### Multi-column Search with Highlighting

```jsx
const MultiColumnSearch = () => {
  const [data, setData] = useState(originalData);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (row) => (
        <HighlightText text={row.name} highlight={searchTerm} />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row) => (
        <HighlightText text={row.email} highlight={searchTerm} />
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: (row) => (
        <HighlightText text={row.department} highlight={searchTerm} />
      ),
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Additional search logic here
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      search={{
        show: true,
        onSearch: handleSearch,
        placeholder: 'Search with highlighting...',
      }}
    />
  );
};

// Helper component for highlighting
const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.filter(String).map((part, i) => (
        regex.test(part) ? (
          <mark key={i} style={{ backgroundColor: 'yellow' }}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </span>
  );
};
```

### Search with Filters

```jsx
const SearchWithFilters = () => {
  const [data, setData] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    department: '',
    status: '',
  });

  const handleSearch = async (searchTerm) => {
    const params = {
      search: searchTerm,
      ...activeFilters,
    };
    
    const filteredData = await fetchWithFilters(params);
    setData(filteredData);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    
    // Re-apply search with new filters
    handleSearch(currentSearchTerm);
  };

  return (
    <div>
      {/* Filter controls */}
      <div style={{ marginBottom: '1rem' }}>
        <select 
          value={activeFilters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
        </select>
        
        <select 
          value={activeFilters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <Datatable
        columns={columns}
        records={data}
        search={{
          show: true,
          isLocalSearch: false,
          onSearch: handleSearch,
          placeholder: 'Search with filters applied...',
        }}
      />
    </div>
  );
};
```

### Search State Persistence

```jsx
const PersistentSearch = () => {
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('datatable-search') || '';
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    // Apply saved search on component mount
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    localStorage.setItem('datatable-search', term);
    
    // Perform search logic
    const filteredData = originalData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setData(filteredData);
  };

  return (
    <Datatable
      columns={columns}
      records={data}
      search={{
        show: true,
        onSearch: handleSearch,
        placeholder: 'Search (saved to localStorage)...',
      }}
    />
  );
};
```

## TypeScript Support

The search functionality is fully typed:

```typescript
import { 
  DatatableSearchConfigInterface 
} from './components/shared/datatable/Datatable.types';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
}

const handleSearch = (searchTerm: string): Promise<void> => {
  // searchTerm is guaranteed to be string
  return performSearch(searchTerm);
};

const searchConfig: DatatableSearchConfigInterface = {
  show: true,
  isLocalSearch: false,
  onSearch: handleSearch,
  placeholder: 'Type to search...',
  searchPosition: 'end',
  isFullWidth: false,
};

<Datatable<Employee>
  columns={columns}
  records={employees}
  search={searchConfig}
/>
```

### Custom Search Hook

```typescript
interface UseSearchOptions {
  debounceMs?: number;
  minSearchLength?: number;
}

const useSearch = <T>(
  data: T[],
  searchFields: (keyof T)[],
  options: UseSearchOptions = {}
) => {
  const { debounceMs = 300, minSearchLength = 1 } = options;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const performSearch = useCallback(
    debounce((term: string) => {
      if (term.length < minSearchLength) {
        setFilteredData(data);
        return;
      }

      const filtered = data.filter(item =>
        searchFields.some(field =>
          String(item[field])
            .toLowerCase()
            .includes(term.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }, debounceMs),
    [data, searchFields, debounceMs, minSearchLength]
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  return {
    searchTerm,
    filteredData,
    handleSearch,
  };
};
```

## Best Practices

### 1. Choose the Right Search Strategy

- **Use Local Search** for small to medium datasets (< 1000 records)
- **Use Remote Search** for large datasets or when search needs to be performed on the server

### 2. Implement Debouncing for Remote Search

```jsx
import { useCallback } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useCallback(
  debounce((searchTerm) => {
    performRemoteSearch(searchTerm);
  }, 300),
  []
);
```

### 3. Provide Clear Placeholders

```jsx
// Good: Descriptive placeholder
placeholder: "Search by name, email, or department..."

// Better: Include search hints
placeholder: "🔍 Search employees (name, email, dept)..."
```

### 4. Handle Empty Search States

```jsx
const handleSearch = async (searchTerm) => {
  if (!searchTerm.trim()) {
    // Handle empty search - show all data or default state
    setData(originalData);
    return;
  }
  
  // Perform search
  await performSearch(searchTerm);
};
```

### 5. Optimize Performance

For large datasets with local search, consider using useMemo:

```jsx
const filteredData = useMemo(() => {
  if (!searchTerm) return originalData;
  
  return originalData.filter(item =>
    searchableFields.some(field =>
      item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
}, [originalData, searchTerm, searchableFields]);
```

### 6. Error Handling

Always implement proper error handling for remote search:

```jsx
const handleSearch = async (searchTerm) => {
  try {
    setLoading(true);
    const results = await performSearch(searchTerm);
    setData(results);
  } catch (error) {
    console.error('Search failed:', error);
    setError('Search failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### 7. Accessibility

The datatable automatically handles keyboard navigation for search. Ensure proper ARIA labels:

```jsx
<Datatable
  search={{
    show: true,
    placeholder: 'Search employees',
    searchDataTest: 'employee-search', // For testing
  }}
/>
```

### 8. Search Analytics

Track search behavior for insights:

```jsx
const handleSearch = (searchTerm) => {
  // Track search analytics
  analytics.track('datatable_search', {
    query: searchTerm,
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
  });
  
  performSearch(searchTerm);
};
```

### 9. Testing Search Functionality

```jsx
// Example test cases
test('should filter data locally when isLocalSearch is true', () => {
  const mockData = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  render(
    <Datatable
      columns={columns}
      records={mockData}
      search={{ isLocalSearch: true }}
    />
  );

  const searchInput = screen.getByPlaceholderText('Search...');
  fireEvent.change(searchInput, { target: { value: 'John' } });
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
});

test('should call onSearch when search term changes', () => {
  const mockOnSearch = jest.fn();
  
  render(
    <Datatable
      columns={columns}
      records={[]}
      search={{ onSearch: mockOnSearch, isLocalSearch: false }}
    />
  );

  const searchInput = screen.getByPlaceholderText('Search...');
  fireEvent.change(searchInput, { target: { value: 'test' } });
  
  expect(mockOnSearch).toHaveBeenCalledWith('test');
});
```

---

## Migration from Previous Versions

If you're upgrading from a previous version where `search` was part of the `config` object:

### Before (Old Structure)
```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    search: {
      show: true,
      isLocalSearch: false,
      onSearch: handleSearch,
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
  search={{
    show: true,
    isLocalSearch: false,
    onSearch: handleSearch,
  }}
  config={{
    // other config options (without search)
  }}
/>
```

This change provides better organization and makes the search functionality more discoverable alongside other main datatable features like `sort` and `columnVisibility`.
