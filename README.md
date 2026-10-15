[![Storybook][badge_storybook]][storybook_link]
[![TypeScript][badge_typescript]][typescript_link]
[![React][badge_react]][react_link]
[![SCSS][badge_scss]][scss_link]

# React datatable component

# Table of contents:
- [Overview](#overview)
- [Demo](#demo)
- [Installation](#installation)
- [Available scripts](#available-scripts)
- [Usage](#usage)
- [Datatable props](#datatable-props)
- [Configuration options](#configuration-options)
- [Features and methods](#features-and-methods)
- [Examples](#examples)
- [TypeScript support](#typescript-support)
- [Styling](#styling)
- [Feature guides](#feature-guides)
- [Resources](#resources)

## Overview:

Advanced and feature-rich datatable component designed to handle complex data visualization and interaction scenarios with maximum flexibility and performance.

It supports the following:
- **Local data handling**: Client-side sorting, filtering, and pagination
- **Remote data handling**: Server-side operations with API integration
- **Column management**: Show/hide columns, custom column definitions
- **Column ordering**: Drag and drop columns, with optional persistence to `localStorage`
- **Row selection**: Single (radio) and multiple (checkbox) row selection with callbacks
- **Advanced pagination**: Customizable pagination with rows-per-page options, custom pagination components, and URL deep linking
- **Search functionality**: Global search with local or remote filtering
- **Sorting**: Single-column sorting (local or remote) with custom sort icons
- **Actions**: Row-level actions with custom handlers, tooltips, and conditional hiding/disabling
- **Row events**: Click, double-click, drag and drop events with custom drag previews
- **Responsive design**: Optional mobile layout below a configurable breakpoint
- **Loading states**: Built-in loading indicators and states
- **Custom styling**: CSS class hooks and custom icons
- **TypeScript support**: Full TypeScript integration with comprehensive type definitions

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Demo:

Explore interactive examples in storybook by running `pnpm storybook`. It features:
- Local datatable with full client-side functionality
- Remote datatable with server-side operations
- Column visibility and column ordering controls
- Row selection examples
- Custom actions and events
- Search and filtering demonstrations
- Pagination scenarios (including custom pagination and deep linking)
- Mobile layout

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Installation:

### Requirements:

- [Node.js](https://nodejs.org/) `>=22.18.0` (required by Babel 8, webpack-dev-server 6, and sass-loader 17)
- [pnpm](https://pnpm.io/) `>=9.0.0`

### Setup:

```bash
git clone https://github.com/DonAdam2/react-datatable.git
cd react-datatable
pnpm install
pnpm start
```

**_Note:_** TypeScript 7 doesn't ship a programmatic API yet, so `typescript` is aliased to the TypeScript 6 compatibility package (`@typescript/typescript6`) for the tools that need it (`ts-loader`, `fork-ts-checker-webpack-plugin`, and `typescript-eslint`). TypeScript 7 is installed as `@typescript/native`, and `tsc` runs TypeScript 7.

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Available scripts:

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

**_Note:_** The production build fails on any linting error.

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

### Basic local datatable:

```jsx
import { useState } from 'react';
import Datatable from './components/shared/datatable/Datatable';

const App = () => {
  const [selectedRows, setSelectedRows] = useState([]);

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
      icon: <EditIcon />,
      onClick: (event, { original }) => console.log('Edit:', original),
      tooltip: { tooltipContent: 'Edit' },
    },
    {
      icon: <DeleteIcon />,
      onClick: (event, { original }) => console.log('Delete:', original),
      tooltip: { tooltipContent: 'Delete' },
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
      columnVisibility={{
        show: true,
        location: 'titleRow',
        defaultVisibleColumns: ['name', 'email'],
      }}
      search={{
        show: true,
        placeholder: 'Search employees...',
      }}
      selection={{
        mode: 'checkbox',
        dataKey: 'id',
        selectedData: selectedRows,
        onSelectionChange: (rows) => setSelectedRows(rows),
      }}
      pagination={{
        enablePagination: true,
        rowsDropdown: {
          rowsPerPage: 10,
        },
      }}
      ui={{
        actionsColWidth: 120,
      }}
    />
  );
};
```

### Remote datatable with server-side operations:

```jsx
import { useState } from 'react';
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

  const handleSort = async (accessorKey, order) => {
    await fetchData({ sortColumn: accessorKey, sortOrder: order });
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
          onPaginationDataUpdate: handlePagination,
          totalRecords: totalRecords,
        },
      }}
    />
  );
};
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Datatable props:

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| columns | [`ColumnDef<T>[]`](#column-definition) | - | Yes | Array of column definitions |
| records | `T[]` | - | Yes | Array of data records to display |
| actions | [`ActionDef<T>[]`](#action-definition) | `undefined` | No | Array of action definitions for each row |
| title | [TitleConfigInterface](#titleconfiginterface) | `undefined` | No | Title configuration object |
| isLoading | `boolean` | `false` | No | Shows loading state when true |
| dataTest | `string` | `undefined` | No | Data test attribute for testing |
| noDataToDisplayMessage | `ReactNode` | `'No data to display'` | No | Custom message when no data is available |
| columnVisibility | [ColumnVisibilityInterface](#columnvisibilityinterface) | `undefined` | No | Column show/hide functionality configuration |
| columnOrdering | [ColumnOrderingInterface](#columnorderinginterface) | `undefined` | No | Column drag and drop ordering configuration |
| search | [SearchConfigInterface](#searchconfiginterface) | `undefined` | No | Search functionality configuration |
| sort | [SortConfigInterface](#sortconfiginterface) | `undefined` | No | Sorting functionality configuration |
| selection | [SelectionConfigInterface](#selectionconfiginterface) | `undefined` | No | Row selection functionality configuration |
| pagination | [PaginationConfigInterface](#paginationconfiginterface) | `undefined` | No | Pagination functionality configuration |
| rowEvents | [`DatatableRowEvents<T>`](#row-events) | `undefined` | No | Row interaction events configuration |
| ui | [UiConfigInterface](#uiconfiginterface) | `undefined` | No | UI appearance and behavior configuration |
| mobileUiData | [MobileUiDataInterface](#mobileuidatainterface) | `undefined` | No | Mobile layout configuration |
| ref | `Ref<DatatableRef>` | `undefined` | No | Reference to access datatable methods |

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Configuration options:

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

### ColumnVisibilityInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| show | `boolean` | `true` | Show the column visibility toggle |
| location | `'titleRow' \| 'searchRow' \| 'actionsColumn'` | `'actionsColumn'` | Where the toggle is rendered |
| trigger | `ButtonInterface` | `undefined` | Custom trigger button (label, icon, variant, ...) |
| defaultVisibleColumns | `string[]` | `undefined` | Accessor keys of the columns visible initially (all others are hidden) |
| hiddenColumns | `string[]` | `undefined` | Accessor keys of the columns hidden initially (ignored when `defaultVisibleColumns` is set) |

Columns with `enableHiding: false` are always visible. See [docs/COLUMN_VISIBILITY.md](docs/COLUMN_VISIBILITY.md) for details.

### ColumnOrderingInterface:

Column ordering is **enabled by default**: columns can be reordered by drag and drop (except the actions and selection columns). Set `enableOrdering: false` on a column to lock it, or `columnOrdering={{ enabled: false }}` to turn the feature off.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enabled | `boolean` | `true` | Enable/disable column ordering |
| onColumnReorder | `(fromIndex: number, toIndex: number, columnOrder: string[]) => void \| Promise<void>` | `undefined` | Called after a column is dropped, with the new order of accessor keys |
| defaultColumnOrder | `string[]` | `undefined` | Initial column order (accessor keys) |
| persistOrder | `{ enabled: boolean; key: string }` | `undefined` | Persist the order to `localStorage` under a stable `key` |
| preview | `(column: ColumnDef) => ReactNode` | `undefined` | Custom drag preview (defaults to a clone of the column) |
| previewOffset | `{ x: number; y: number }` | `{ x: 10, y: 10 }` | Gap between the cursor and the drag preview |
| previewClassName | `string` | `undefined` | Class name for the default drag preview (ignored when `preview` is set) |

See [docs/COLUMN_ORDERING.md](docs/COLUMN_ORDERING.md) for details.

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
| onUpdateFilteredRecordsCount | `(count: number) => void` | `undefined` | **Required for custom pagination** - Callback for filtered record count updates |

#### ⚠️ Important: custom pagination requirement

When using **custom pagination** (providing your own `paginationComponent`), you **must** include the `onUpdateFilteredRecordsCount` prop in your search configuration:

```jsx
// ✅ REQUIRED when using custom pagination
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    isLocalSearch: true,
    onUpdateFilteredRecordsCount: (filteredCount) => {
      setTotalRecords(filteredCount); // Update your pagination state
    },
  }}
  pagination={{
    paginationComponent: <CustomPagination totalRecords={totalRecords} />,
  }}
/>
```

**Why is this needed?**
- When users search/filter data, the total record count changes
- Custom pagination components need the updated count for correct page calculations
- Without this prop, pagination will show incorrect totals and navigation

**Note:** This prop is **not required** when using the built-in pagination component.

### SortConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| isLocalSort | `boolean` | `true` | Sort records on the client |
| onSorting | `(accessorKey: string, order: 'asc' \| 'desc') => void \| Promise<void>` | `undefined` | Called when a column is sorted (use it with `isLocalSort: false` for server-side sorting) |

Sorting is enabled per column with `enableSorting`. See [docs/SORT.md](docs/SORT.md) for details.

### SelectionConfigInterface:

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| mode | `'checkbox' \| 'radio'` | - | Yes | Selection mode |
| dataKey | `keyof T \| string` | - | Yes | Unique key used to identify selected rows |
| selectedData | `T \| T[] \| null \| undefined` | - | Yes | Currently selected row (`radio`) or rows (`checkbox`) |
| onSelectionChange | `(data: T \| T[]) => void` | - | Yes | Selection change handler |
| disabled | `boolean \| BooleanFuncType<T>` | `false` | No | Disable selection for all or specific rows |
| hidden | `boolean \| BooleanFuncType<T>` | `false` | No | Hide selection for all or specific rows |
| selectAllCheckbox | `{ disabled?: boolean; hidden?: boolean }` | `undefined` | No | Disable or hide the "select all" checkbox |
| className | `string` | `undefined` | No | CSS class for the selection inputs |

`BooleanFuncType<T>` is `(rowInfo: RowInfo<T>) => boolean`. See [docs/SELECTION.md](docs/SELECTION.md) for details.

### PaginationConfigInterface:

The pagination prop accepts one of three shapes: **local** (built-in pagination over `records`), **remote** (with `remoteControl`), or **custom** (with your own `paginationComponent`).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enablePagination | `boolean` | `true` | Enable/disable pagination |
| rowsDropdown | [RowsDropdownInterface](#rowsdropdowninterface) | `undefined` | Rows per page configuration (local and remote) |
| remoteControl | [RemoteControlInterface](#remotecontrolinterface) | `undefined` | Remote pagination configuration |
| deepLinking | [DeepLinkingConfig](#deeplinkingconfig) | `undefined` | Sync the active page (and page size) with the URL (local and remote) |
| rangeSeparatorLabel | `string` | `'of'` | Separator text in pagination range (e.g., "1 - 10 of 30") |
| paginationComponent | `ReactNode` | `undefined` | Custom pagination component (see [custom pagination](#custom-pagination-with-usepagination)) |
| firstContentIndex | `number` | `undefined` | Index of the first record of the current page (custom pagination) |
| lastContentIndex | `number` | `undefined` | Index after the last record of the current page (custom pagination) |
| resetPagination | `() => { activePage: number; rowsPerPageNum: number } \| void \| Promise<void>` | `undefined` | Called when the datatable needs to go back to the first page, e.g. after a search (custom pagination) |

### RowsDropdownInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| enableRowsDropdown | `boolean` | `true` | Show rows per page selector |
| rowsPerPage | `number` | `10` | Default rows per page |
| optionsList | `DatatableRowsDropdownOption[]` | `[5, 10, 20, 30, 40]` | Available rows per page options (`{ value: number; displayValue: string }`) |

### RemoteControlInterface:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| onPaginationDataUpdate | `(currentPage: number, rowsPerPageNum: number) => void \| Promise<void>` | Yes | Called when the page or page size changes, fetch the new page here |
| totalRecords | `number` | Yes | Total number of records on the server |

### DeepLinkingConfig:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| pageNumKey | `string` | Yes | URL search param for the active page (e.g. `page`) |
| pageSizeKey | `string` | No | URL search param for the page size (e.g. `pageSize`) |

```jsx
pagination={{
  deepLinking: {
    pageNumKey: 'page',
    pageSizeKey: 'pageSize',
  },
}}
// => https://example.com/employees?page=2&pageSize=20
```

The page is restored from the URL on load, and the browser back/forward buttons update the table. See [docs/PAGINATION.md](docs/PAGINATION.md) for details.

### TitleConfigInterface:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| titleLabel | `string \| ReactNode` | `undefined` | Title text or component |
| titlePosition | `'start' \| 'end'` | `'start'` | Title alignment |
| titleLocation | `'titleRow' \| 'searchRow'` | `'titleRow'` | Title placement |
| titleButtons | `ButtonInterface[]` | `undefined` | Action buttons in title area |
| titleButtonsPosition | `'start' \| 'end'` | `'end'` | Buttons alignment |
| titleButtonsLocation | `'titleRow' \| 'searchRow'` | `'titleRow'` | Buttons placement |

### MobileUiDataInterface:

When provided, the table switches to a mobile layout below `mobileBreakpoint`: the header is hidden and each row renders the `column` and `action` content instead of the regular cells.

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| column | `(row: T, index?: number) => ReactNode` | - | Yes | Content of the row in the mobile layout |
| action | `(row: T, index?: number) => ReactNode` | - | Yes | Actions of the row in the mobile layout |
| mobileBreakpoint | `number` | `768` | No | Width in px below which the mobile layout is shown |

```jsx
mobileUiData={{
  column: (row) => (
    <div>
      <strong>{row.name}</strong>
      <p>{row.email}</p>
    </div>
  ),
  action: (row) => <RowActionsMenu row={row} />,
}}
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Features and methods:

### Column definition:

```typescript
interface ColumnDef<T> {
  accessorKey: keyof T | string; // supports nested keys, e.g. 'subscription.status'
  header?: ReactNode;
  className?: string;
  enableSorting?: boolean;
  enableHiding?: boolean; // default true, set to false to always show the column
  enableOrdering?: boolean; // default true, set to false to lock the column position
  cell?: (rowInfo: RowInfo<T>) => ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  noWrap?: boolean;
  direction?: string;
}

interface RowInfo<T> {
  original: T; // the row record
  getValue: (key: string) => any; // read a (nested) value of the row
}
```

### Action definition:

```typescript
interface ActionDef<T> {
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>, rowInfo: RowInfo<T>) => void;
  cell?: (rowInfo: RowInfo<T>) => ReactNode; // render custom content instead of an icon button
  disabled?: boolean | BooleanFuncType<T>;
  hidden?: boolean | BooleanFuncType<T>;
  tooltip?: ActionTooltipInterface;
}

interface ActionTooltipInterface {
  tooltipContent: string; // can contain HTML, e.g. '<em>Edit</em>'
  position?: TooltipPositionEnum;
  trigger?: TooltipTriggerEnum;
  color?: string;
  backgroundColor?: string;
  className?: string;
  messageClassName?: string;
  isDisplayIndicator?: boolean;
}
```

### Row events:

```typescript
interface DatatableRowEvents<T> {
  onClick?: {
    clickable?: boolean | BooleanFuncType<T>;
    event: (e: MouseEvent, rowInfo: RowInfo<T>) => void;
  };
  onDoubleClick?: {
    clickable?: boolean | BooleanFuncType<T>;
    event: (e: MouseEvent, rowInfo: RowInfo<T>) => void;
  };
  onDragStart?: {
    draggable?: boolean | BooleanFuncType<T>;
    event: (e: DragEvent, rowInfo: RowInfo<T>) => void;
    preview?: (rowInfo: RowInfo<T>) => ReactNode; // custom drag preview
    previewOffset?: { x: number; y: number }; // default { x: 0, y: 0 }
  };
  onDrop?: {
    droppable?: boolean | BooleanFuncType<T>;
    event: (e: DragEvent, rowInfo: RowInfo<T>) => void;
  };
}
```

See [docs/ROW_EVENTS.md](docs/ROW_EVENTS.md) for details.

### Programmatic control:

The datatable exposes methods through refs for programmatic control:

```typescript
interface DatatableRef {
  resetPagination: () => { activePage: number; rowsPerPageNum: number };
}
```

**Usage example:**

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

### Custom pagination with `usePagination`:

The `usePagination` hook (`src/hooks/usePagination.ts`) powers the built-in pagination and can drive your own pagination component:

```jsx
import usePagination from '@/hooks/usePagination';

const EmployeesTable = ({ employees }) => {
  const [totalRecords, setTotalRecords] = useState(employees.length);
  const paginationData = usePagination({ contentPerPage: 10, count: totalRecords });
  const { firstContentIndex, lastContentIndex, navigateToFirstPage } = paginationData;

  return (
    <Datatable
      columns={columns}
      records={employees}
      search={{ onUpdateFilteredRecordsCount: setTotalRecords }}
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

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| contentPerPage | `number` | Yes | Rows per page |
| count | `number` | Yes | Total number of records |
| fetchData | `(page: number, perPage: number) => Promise<void>` | No | Called on page changes (remote data) |
| deepLinking | [DeepLinkingConfig](#deeplinkingconfig) | No | Sync the page with the URL |

It returns `activePage`, `totalPages`, `contentPerPage`, `paginationBlocks`, `firstContentIndex`, `lastContentIndex`, and the navigation methods `navigateToPage`, `navigateToNextPage`, `navigateToPrevPage`, `navigateToFirstPage`, `navigateToLastPage`, `navigateToNextPaginationBlock`, `navigateToPrevPaginationBlock`, and `updateCurrentRowsPerPage`.

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Examples:

### Column visibility control:

```jsx
<Datatable
  columns={columns}
  records={data}
  columnVisibility={{
    show: true,
    location: 'titleRow', // 'titleRow' | 'searchRow' | 'actionsColumn'
    defaultVisibleColumns: ['name', 'email'], // Show only these columns initially
    trigger: {
      label: 'Manage Columns',
      icon: <SettingsIcon />,
      variant: 'outline',
    },
  }}
  pagination={{
    enablePagination: true,
  }}
  ui={{
    actionsColWidth: 120,
  }}
/>
```

### Column ordering:

```jsx
<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    defaultColumnOrder: ['email', 'name', 'id'],
    persistOrder: { enabled: true, key: 'employees-table' },
    onColumnReorder: (fromIndex, toIndex, columnOrder) => {
      console.log('New column order:', columnOrder);
    },
  }}
/>
```

### Custom row events:

```jsx
<Datatable
  columns={columns}
  records={data}
  rowEvents={{
    onClick: {
      clickable: true,
      event: (e, rowInfo) => {
        console.log('Row clicked:', rowInfo.original);
      },
    },
    onDoubleClick: {
      clickable: true,
      event: (e, rowInfo) => {
        console.log('Row double-clicked:', rowInfo.original);
      },
    },
    onDragStart: {
      draggable: true,
      event: (e, rowInfo) => {
        console.log('Row drag started:', rowInfo.original);
      },
    },
    onDrop: {
      droppable: true,
      event: (e, rowInfo) => {
        console.log('Row dropped:', rowInfo.original);
      },
    },
  }}
/>
```

### Advanced search configuration:

```jsx
<Datatable
  columns={columns}
  records={data}
  search={{
    show: true,
    placeholder: 'Search by name, email, or department...',
    searchPosition: 'start',
    isFullWidth: true,
    onSearch: async (searchTerm) => {
      // Custom search logic
      const results = await searchAPI(searchTerm);
      setFilteredData(results);
    },
  }}
/>
```

### Custom no data message:

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

## TypeScript support:

The datatable component is built with TypeScript and provides comprehensive type definitions:

```typescript
import Datatable from './components/shared/datatable/Datatable';
import { ColumnDef, ActionDef } from './components/shared/datatable/Datatable.types';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

const MyTypedDatatable = ({ employees }: { employees: Employee[] }) => {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: 'Full Name',
      enableSorting: true,
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ original }) => `$${original.salary.toLocaleString()}`,
    },
  ];

  const actions: ActionDef<Employee>[] = [
    {
      icon: <EditIcon />,
      onClick: (event, { original }) => editEmployee(original.id),
      disabled: ({ original }) => original.department === 'HR',
    },
  ];

  return (
    <Datatable<Employee>
      columns={columns}
      records={employees}
      actions={actions}
      ui={{
        actionsColWidth: 120,
        showTableHeader: true,
      }}
      // TypeScript will validate all props and configurations
    />
  );
};
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Styling:

### CSS classes available for customization:

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

// Default column drag preview (always applied, see `columnOrdering.previewClassName`)
.column-drag-image {
  // Custom styles
}
```

### Custom theme example:

The component doesn't expose theme variables. To theme it, pass a class through `ui.tableWrapperClassName` (or `ui.tableClassName`) and override the classes above:

```scss
.my-custom-datatable {
  .table thead th {
    background-color: #f8f9fa;
    border-color: #e0e0e0;
  }

  .table tbody tr:hover {
    background-color: #f1f3f4;
  }
}
```

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Feature guides:

Detailed guides for each feature are available in the [docs](docs) folder:

- [Column ordering](docs/COLUMN_ORDERING.md)
- [Column visibility](docs/COLUMN_VISIBILITY.md)
- [Pagination](docs/PAGINATION.md)
- [Row events](docs/ROW_EVENTS.md)
- [Search](docs/SEARCH.md)
- [Selection](docs/SELECTION.md)
- [Sort](docs/SORT.md)
- [UI](docs/UI.md)

<p dir="rtl"><a href="#table-of-contents">Back to top</a></p>

## Resources:

- [Storybook](#demo) - Interactive examples and component playground (run `pnpm storybook`)
- [TypeScript documentation][typescript_link] - Type definitions and interfaces
- [React documentation][react_link] - React best practices and patterns
- [SCSS documentation][scss_link] - Styling and theming guide

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
[storybook_link]: #demo
[typescript_link]: https://www.typescriptlang.org/
[react_link]: https://react.dev/
[scss_link]: https://sass-lang.com/
