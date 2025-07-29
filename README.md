[![Storybook][badge_storybook]][storybook_link]
[![TypeScript][badge_typescript]][typescript_link]
[![React][badge_react]][react_link]
[![SCSS][badge_scss]][scss_link]

# React Datatable Component

# Table of Contents:
- [Overview](#overview)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Datatable Props](#datatable-props)
- [Configuration Options](#configuration-options)
- [Features and Methods](#features-and-methods)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Styling](#styling)
- [Resources](#resources)

## Overview:

Advanced and feature-rich datatable component designed to handle complex data visualization and interaction scenarios with maximum flexibility and performance.

It supports the following:
- **Local Data Handling**: Client-side sorting, filtering, and pagination
- **Remote Data Handling**: Server-side operations with API integration
- **Column Management**: Show/hide columns, custom column definitions
- **Row Selection**: Single and multiple row selection with callbacks
- **Advanced Pagination**: Customizable pagination with rows-per-page options
- **Search Functionality**: Global search with local or remote filtering
- **Sorting**: Multi-column sorting with custom sort indicators
- **Actions**: Row-level and bulk actions with custom handlers
- **Responsive Design**: Mobile-friendly with customizable layouts
- **Loading States**: Built-in loading indicators and states
- **Custom Styling**: Extensive theming and styling options
- **TypeScript Support**: Full TypeScript integration with comprehensive type definitions
- **Accessibility**: ARIA-compliant with keyboard navigation support

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Demo:

Explore interactive examples in storybook by running `pnpm storybook`. It features:
- Local datatable with full client-side functionality
- Remote datatable with server-side operations
- Column visibility controls
- Row selection examples
- Custom actions and events
- Search and filtering demonstrations
- Pagination scenarios

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.<br>
It will automatically detect and use an available port, typically starting at [http://localhost:3000](http://localhost:3000) and open it in the browser.

All changes will be injected automatically without reloading the page.<br>

You will see in the console the following:

- All development logs and errors
- Any of the following errors:
  1. Linting errors.
  2. Code format errors (because of [prettier](https://prettier.io/))
  3. TypeScript compilation errors

### `pnpm build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `pnpm build:serve`

Serves the app on `http://localhost:8080/` from the `dist` folder to check the production version.

**_Note:_** Use this script only if you ran the build script `pnpm build`.

### `pnpm analyze-bundle`

It allows you to analyze the bundle size by generating a stats.json file and opening the webpack bundle analyzer.

### `pnpm storybook`

Runs Storybook in development mode on [http://localhost:6006](http://localhost:6006).<br>
This provides an interactive environment to develop and test components in isolation.

### `pnpm build-storybook`

Builds Storybook for production to the `storybook-static` folder.

### `pnpm generate` **_component_** || **_page_** || **_hook_** || **_service_** || **_reducer_** || **_progressiveWebApp_**

- It creates a boilerplate for component, page, custom hook, service, reducer or progressive web app setup using Plop.

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Usage:

### Basic Local Datatable:

```jsx
import Datatable from './components/shared/datatable/Datatable';

const App = () => {
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
    },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // ... more data
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (row) => console.log('Edit:', row),
      icon: <EditIcon />,
    },
    {
      label: 'Delete',
      onClick: (row) => console.log('Delete:', row),
      icon: <DeleteIcon />,
    },
  ];

  return (
    <Datatable
      title={{
        titleLabel: 'Employee Management',
        titleLocation: 'titleRow',
      }}
      columns={columns}
      records={data}
      actions={actions}
      config={{
        ui: {
          actionsColWidth: 120,
        },
        search: {
          show: true,
          placeholder: 'Search employees...',
        },
        selection: {
          mode: 'checkbox',
          onSelectionChange: (selectedRows) => {
            console.log('Selected:', selectedRows);
          },
        },
      }}
    />
  );
};
```

### Remote Datatable with Server-side Operations:

```jsx
import { useState, useEffect } from 'react';
import Datatable from './components/shared/datatable/Datatable';

const RemoteDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
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

  const handlePagination = async (page, rowsPerPage) => {
    await fetchData({ page, rowsPerPage });
  };

  const handleSearch = async (searchTerm) => {
    await fetchData({ searchTerm, page: 1 });
  };

  const handleSort = async (column, order) => {
    await fetchData({ sortColumn: column, sortOrder: order });
  };

  return (
    <Datatable
      title={{
        titleLabel: 'Remote Employee Data',
        titleLocation: 'titleRow',
      }}
      columns={columns}
      records={data}
      isLoading={loading}
      config={{
        search: {
          onSearch: handleSearch,
          isLocalSearch: false,
        },
        sort: {
          onSorting: handleSort,
          isLocalSort: false,
        },
        pagination: {
          remoteControl: {
            onPaginationDataUpdate: handlePagination,
            totalRecords: totalRecords,
          },
        },
      }}
    />
  );
};
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Datatable Props:

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| columns | `ColumnDef<T>[]` | - | Yes | Array of column definitions |
| records | `T[]` | - | Yes | Array of data records to display |
| actions | `ActionDef<T>[]` | `undefined` | No | Array of action definitions for each row |
| title | [TitleConfigInterface](#titleconfiginterface) | `undefined` | No | Title configuration object |
| isLoading | `boolean` | `false` | No | Shows loading state when true |
| dataTest | `string` | `undefined` | No | Data test attribute for testing |
| noDataToDisplayMessage | `ReactNode` | `'No data to display'` | No | Custom message when no data is available |
| config | [DatatableConfigInterface](#datatableconfiginterface) | `undefined` | No | Main configuration object for all datatable features |
| ref | `Ref<DatatableRef>` | `undefined` | No | Reference to access datatable methods |

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Configuration Options:

### DatatableConfigInterface:

| Property | Type | Description |
|----------|------|-------------|
| ui | [UiConfigInterface](#uiconfiginterface) | UI customization options |
| search | [SearchConfigInterface](#searchconfiginterface) | Search functionality configuration |
| sort | [SortConfigInterface](#sortconfiginterface) | Sorting functionality configuration |
| selection | [SelectionConfigInterface](#selectionconfiginterface) | Row selection configuration |
| rowEvents | [RowEventsInterface](#roweventsinterface) | Row interaction events |
| columnVisibility | [ColumnVisibilityInterface](#columnvisibilityinterface) | Column show/hide functionality |
| pagination | [PaginationConfigInterface](#paginationconfiginterface) | Pagination configuration |

### UiConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| showTableHeader | `boolean` | `true` | Show/hide table header |
| tableWrapperClassName | `string` | `''` | CSS class for table wrapper |
| tableClassName | `string` | `''` | CSS class for table element |
| titleStyles | `CSSProperties` | `undefined` | Inline styles for title |
| isActionsColumnLast | `boolean` | `undefined` | Position actions column at the end |
| actionsColLabel | `string` | `''` | Label for actions column header |
| actionsColWidth | `number \| string` | `undefined` | Width of actions column |
| loadingIcon | `ReactNode` | `<LoadingIcon />` | Custom loading indicator |
| sortIcon | `ReactNode` | `undefined` | Default sort icon |
| ascendingSortIcon | `ReactNode` | `undefined` | Ascending sort icon |
| descendingSortIcon | `ReactNode` | `undefined` | Descending sort icon |
| paginationRangeSeparatorLabel | `string` | `'of'` | Separator text in pagination range |

### SearchConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| show | `boolean` | `true` | Show/hide search functionality |
| onSearch | `(searchTerm: string) => void \| Promise<void>` | `undefined` | Search handler function |
| isLocalSearch | `boolean` | `true` | Enable client-side search |
| isFullWidth | `boolean` | `false` | Make search input full width |
| placeholder | `string` | `'Search...'` | Search input placeholder |
| searchDataTest | `string` | `undefined` | Data test attribute for search |
| searchPosition | `'start' \| 'end'` | `'end'` | Position of search input |

### SelectionConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| mode | `'checkbox' \| 'radio'` | `undefined` | Selection mode |
| onSelectionChange | `(selectedRows: T[]) => void` | `undefined` | Selection change handler |
| isSelectAllDisabled | `boolean` | `false` | Disable select all functionality |
| hidden | `boolean \| BooleanFuncType` | `false` | Hide selection for specific rows |
| disabled | `boolean \| BooleanFuncType` | `false` | Disable selection for specific rows |

### PaginationConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enablePagination | `boolean` | `true` | Enable/disable pagination |
| rowsDropdown | [RowsDropdownInterface](#rowsdropdowninterface) | `undefined` | Rows per page configuration |
| remoteControl | [RemoteControlInterface](#remotecontrolinterface) | `undefined` | Remote pagination configuration |
| deepLinking | `DeepLinkingConfig` | `undefined` | URL-based pagination state |

### RowsDropdownInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enableRowsDropdown | `boolean` | `true` | Show rows per page selector |
| rowsPerPage | `number` | `10` | Default rows per page |
| optionsList | `DatatableRowsDropdownOption[]` | `[5, 10, 20, 30, 40]` | Available rows per page options |

### TitleConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| titleLabel | `string \| ReactNode` | `undefined` | Title text or component |
| titlePosition | `'start' \| 'end'` | `'start'` | Title alignment |
| titleLocation | `'titleRow' \| 'searchRow'` | `'titleRow'` | Title placement |
| titleButtons | `ButtonInterface[]` | `undefined` | Action buttons in title area |
| titleButtonsPosition | `'start' \| 'end'` | `'end'` | Buttons alignment |
| titleButtonsLocation | `'titleRow' \| 'searchRow'` | `'titleRow'` | Buttons placement |

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Features and Methods:

### Column Definition:

```typescript
interface ColumnDef<T> {
  accessorKey: keyof T | string;
  header: string | ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  cell?: (rowData: T) => ReactNode;
  width?: number | string;
  className?: string;
}
```

### Action Definition:

```typescript
interface ActionDef<T> {
  label: string;
  onClick: (rowData: T, index: number) => void;
  icon?: ReactNode;
  isHidden?: boolean | BooleanFuncType;
  isDisabled?: boolean | BooleanFuncType;
  tooltip?: ActionTooltipInterface;
  className?: string;
}
```

### Programmatic Control:

The datatable exposes methods through refs for programmatic control:

```typescript
interface DatatableRef {
  resetPagination: () => { activePage: number; rowsPerPageNum: number };
}
```

**Usage Example:**

```jsx
import { useRef } from 'react';

const MyComponent = () => {
  const datatableRef = useRef(null);

  const resetTable = () => {
    datatableRef.current?.resetPagination();
  };

  return (
    <>
      <button onClick={resetTable}>Reset Pagination</button>
      <Datatable
        ref={datatableRef}
        // ... other props
      />
    </>
  );
};
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Examples:

### Column Visibility Control:

```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    columnVisibility: {
      show: true,
      location: 'titleRow', // 'titleRow' | 'searchRow' | 'actionsColumn'
      defaultVisibleColumns: ['name', 'email'], // Show only these columns initially
      trigger: {
        label: 'Manage Columns',
        icon: <SettingsIcon />,
        variant: 'outline',
      },
    },
  }}
/>
```

### Custom Row Events:

```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    rowEvents: {
      onRowClick: (row, index) => {
        console.log('Row clicked:', row);
      },
      onRowDoubleClick: (row, index) => {
        console.log('Row double-clicked:', row);
      },
      onRowMouseEnter: (row, index) => {
        console.log('Mouse entered row:', row);
      },
    },
  }}
/>
```

### Advanced Search Configuration:

```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    search: {
      show: true,
      placeholder: 'Search by name, email, or department...',
      searchPosition: 'start',
      isFullWidth: true,
      onSearch: async (searchTerm) => {
        // Custom search logic
        const results = await searchAPI(searchTerm);
        setFilteredData(results);
      },
    },
  }}
/>
```

### Custom No Data Message:

```jsx
<Datatable
  columns={columns}
  records={[]} // Empty data
  noDataToDisplayMessage={
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h3>No employees found</h3>
      <p>Try adjusting your search criteria or add new employees.</p>
      <Button 
        label="Add Employee" 
        onClick={() => openAddEmployeeModal()} 
      />
    </div>
  }
/>
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## TypeScript Support:

The datatable component is built with TypeScript and provides comprehensive type definitions:

```typescript
import Datatable, { 
  DatatableInterface,
  ColumnDef,
  ActionDef,
  DatatableRef 
} from './components/shared/datatable/Datatable';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

const MyTypedDatatable: React.FC = () => {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: 'Full Name',
      enableSorting: true,
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: (row) => `$${row.salary.toLocaleString()}`,
    },
  ];

  const actions: ActionDef<Employee>[] = [
    {
      label: 'Edit',
      onClick: (employee) => editEmployee(employee.id),
      isDisabled: (employee) => employee.department === 'HR',
    },
  ];

  return (
    <Datatable<Employee>
      columns={columns}
      records={employees}
      actions={actions}
      // TypeScript will validate all props and configurations
    />
  );
};
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Styling:

### CSS Classes Available for Customization:

```scss
// Main datatable wrapper
.table-wrapper {
  // Custom styles
}

// Table element
.table {
  // Custom styles
}

// Loading overlay
.center-loader-wrapper {
  // Custom styles
}

// No data message
.no-data {
  // Custom styles
}

// Action column visibility button
.actions-col-visibility-button {
  // Custom styles
}

// Pagination components
.datatable-footer {
  // Custom styles
}

.datatable-pagination {
  // Custom styles
}
```

### Custom Theme Example:

```scss
.my-custom-datatable {
  .table {
    --datatable-border-color: #e0e0e0;
    --datatable-header-bg: #f8f9fa;
    --datatable-row-hover: #f1f3f4;
    --datatable-selected-bg: #e3f2fd;
  }

  .table thead th {
    background-color: var(--datatable-header-bg);
    border-color: var(--datatable-border-color);
  }

  .table tbody tr:hover {
    background-color: var(--datatable-row-hover);
  }
}
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Resources:

- [Storybook Documentation][storybook_link] - Interactive examples and component playground
- [TypeScript Documentation][typescript_link] - Type definitions and interfaces
- [React Documentation][react_link] - React best practices and patterns
- [SCSS Documentation][scss_link] - Styling and theming guide

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

---

## Contributing:

Contributions are welcome! Please submit pull requests for any improvements.

## License:

This project is licensed under the MIT License - see the LICENSE file for details.

[badge_storybook]: https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg
[badge_typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white
[badge_react]: https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB
[badge_scss]: https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white
[storybook_link]: #
[typescript_link]: https://www.typescriptlang.org/
[react_link]: https://reactjs.org/
[scss_link]: https://sass-lang.com/
