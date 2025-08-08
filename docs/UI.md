# UI Configuration

This document provides comprehensive information about the UI configuration options available in the React Datatable component.

## Table of Contents

- [Overview](#overview)
- [UI Configuration Interface](#ui-configuration-interface)
- [Property Details](#property-details)
- [Examples](#examples)
- [Styling Guidelines](#styling-guidelines)

## Overview

The `ui` prop allows you to customize the visual appearance and behavior of the datatable component. This includes everything from table styling and layout to custom icons and loading indicators.

## UI Configuration Interface

```typescript
interface DatatableUiConfigInterface extends SortIconsInterface {
  showTableHeader?: boolean;
  tableWrapperClassName?: string;
  tableClassName?: string;
  titleStyles?: CSSProperties;
  isActionsColumnLast?: boolean;
  actionsColLabel?: string;
  actionsColWidth?: number | string;
  loadingIcon?: ReactNode;
}

interface SortIconsInterface {
  sortIcon?: ReactNode;
  ascendingSortIcon?: ReactNode;
  descendingSortIcon?: ReactNode;
}
```

## Property Details

### Table Structure

#### `showTableHeader`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Controls whether the table header row is displayed
- **Example:**
```jsx
<Datatable
  ui={{ showTableHeader: false }}
  // ... other props
/>
```

#### `tableWrapperClassName`
- **Type:** `string`
- **Default:** `''`
- **Description:** CSS class name applied to the table wrapper container
- **Example:**
```jsx
<Datatable
  ui={{ tableWrapperClassName: 'custom-table-wrapper' }}
  // ... other props
/>
```

#### `tableClassName`
- **Type:** `string`
- **Default:** `''`
- **Description:** CSS class name applied to the table element itself
- **Example:**
```jsx
<Datatable
  ui={{ tableClassName: 'custom-table-styles' }}
  // ... other props
/>
```

### Title Customization

#### `titleStyles`
- **Type:** `CSSProperties`
- **Default:** `undefined`
- **Description:** Inline styles applied to the title element
- **Example:**
```jsx
<Datatable
  ui={{
    titleStyles: {
      color: '#2563eb',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    }
  }}
  // ... other props
/>
```

### Actions Column

#### `isActionsColumnLast`
- **Type:** `boolean`
- **Default:** `undefined` (actions column appears first)
- **Description:** When true, moves the actions column to the end of the table
- **Example:**
```jsx
<Datatable
  ui={{ isActionsColumnLast: true }}
  // ... other props
/>
```

#### `actionsColLabel`
- **Type:** `string | ReactNode`
- **Default:** `''`
- **Description:** Label/header text for the actions column
- **Example:**
```jsx
<Datatable
  ui={{ actionsColLabel: 'Operations' }}
  // ... other props
/>

// With custom component
<Datatable
  ui={{
    actionsColLabel: <span className="text-blue-600">Actions</span>
  }}
  // ... other props
/>
```

#### `actionsColWidth`
- **Type:** `number | string`
- **Default:** `undefined`
- **Description:** Width of the actions column (pixels or CSS units)
- **Example:**
```jsx
<Datatable
  ui={{ actionsColWidth: 120 }}
  // ... other props
/>

// With CSS units
<Datatable
  ui={{ actionsColWidth: '10rem' }}
  // ... other props
/>
```

### Loading State

#### `loadingIcon`
- **Type:** `ReactNode`
- **Default:** `<LoadingIcon />`
- **Description:** Custom loading indicator component
- **Example:**
```jsx
import { Spinner } from 'your-ui-library';

<Datatable
  ui={{
    loadingIcon: <Spinner size="large" color="blue" />
  }}
  // ... other props
/>
```

### Sorting Icons

#### `sortIcon`
- **Type:** `ReactNode`
- **Default:** `undefined`
- **Description:** Default icon displayed in sortable column headers
- **Example:**
```jsx
import { SortIcon } from 'your-icon-library';

<Datatable
  ui={{ sortIcon: <SortIcon /> }}
  // ... other props
/>
```

#### `ascendingSortIcon`
- **Type:** `ReactNode`
- **Default:** `undefined`
- **Description:** Icon displayed when column is sorted in ascending order
- **Example:**
```jsx
import { ChevronUpIcon } from 'your-icon-library';

<Datatable
  ui={{ ascendingSortIcon: <ChevronUpIcon /> }}
  // ... other props
/>
```

#### `descendingSortIcon`
- **Type:** `ReactNode`
- **Default:** `undefined`
- **Description:** Icon displayed when column is sorted in descending order
- **Example:**
```jsx
import { ChevronDownIcon } from 'your-icon-library';

<Datatable
  ui={{ descendingSortIcon: <ChevronDownIcon /> }}
  // ... other props
/>
```

### Pagination

> **Note:** Pagination-related configurations like `rangeSeparatorLabel` have been moved to the `pagination` prop. See the [PAGINATION.md](./PAGINATION.md) documentation for details.

## Examples

### Basic UI Configuration

```jsx
import Datatable from './components/shared/datatable/Datatable';

const BasicExample = () => (
  <Datatable
    columns={columns}
    records={data}
    ui={{
      showTableHeader: true,
      actionsColWidth: 120,
      tableClassName: 'my-custom-table'
    }}
  />
);
```

### Custom Icons and Styling

```jsx
import {
  FilterIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  LoadingSpinner
} from 'your-icon-library';

const CustomIconsExample = () => (
  <Datatable
    columns={columns}
    records={data}
    ui={{
      sortIcon: <FilterIcon className="w-4 h-4" />,
      ascendingSortIcon: <ChevronUpIcon className="w-4 h-4 text-green-600" />,
      descendingSortIcon: <ChevronDownIcon className="w-4 h-4 text-red-600" />,
      loadingIcon: <LoadingSpinner size="lg" />,
      titleStyles: {
        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '1.75rem',
        fontWeight: 'bold'
      }
    }}
  />
);
```

### Actions Column Customization

```jsx
const ActionsCustomExample = () => (
  <Datatable
    columns={columns}
    records={data}
    actions={actions}
    ui={{
      isActionsColumnLast: true,
      actionsColLabel: (
        <span className="flex items-center gap-2">
          <SettingsIcon className="w-4 h-4" />
          Operations
        </span>
      ),
      actionsColWidth: '150px'
    }}
  />
);
```

### Complete UI Configuration

```jsx
const CompleteExample = () => (
  <Datatable
    columns={columns}
    records={data}
    actions={actions}
    ui={{
      // Table structure
      showTableHeader: true,
      tableWrapperClassName: 'custom-datatable-wrapper',
      tableClassName: 'custom-datatable-table',
      
      // Title customization
      titleStyles: {
        color: '#1f2937',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      
      // Actions column
      isActionsColumnLast: true,
      actionsColLabel: 'Actions',
      actionsColWidth: 140,
      
      // Icons
      sortIcon: <FilterIcon />,
      ascendingSortIcon: <ChevronUpIcon />,
      descendingSortIcon: <ChevronDownIcon />,
      loadingIcon: <CustomSpinner />,
      
      // Note: Pagination-related configs now moved to pagination prop
    }}
  />
);
```

## Styling Guidelines

### CSS Classes

The following CSS classes are commonly used for styling and can be referenced in your custom stylesheets:

```scss
// Table wrapper
.custom-datatable-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

// Table element
.custom-datatable-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid #e9ecef;
  }
  
  td {
    padding: 12px;
    border-bottom: 1px solid #e9ecef;
  }
  
  tbody tr:hover {
    background-color: #f8f9fa;
  }
}

// Actions column specific styling
.datatable-actions-column {
  white-space: nowrap;
  text-align: center;
}
```

### Responsive Considerations

When configuring UI properties, consider responsive design:

```jsx
const ResponsiveExample = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <Datatable
      columns={columns}
      records={data}
      ui={{
        actionsColWidth: isMobile ? 80 : 120,
        tableClassName: isMobile ? 'mobile-table' : 'desktop-table',
        showTableHeader: !isMobile, // Hide header on mobile
        titleStyles: {
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }
      }}
    />
  );
};
```

### Accessibility

Ensure your UI configuration maintains accessibility:

```jsx
const AccessibleExample = () => (
  <Datatable
    columns={columns}
    records={data}
    ui={{
      sortIcon: (
        <FilterIcon 
          aria-label="Sort column"
          role="button"
          tabIndex={0}
        />
      ),
      loadingIcon: (
        <LoadingSpinner 
          aria-label="Loading data"
          role="status"
        />
      ),
      actionsColLabel: (
        <span role="columnheader" aria-label="Available actions">
          Actions
        </span>
      )
    }}
  />
);
```

## Migration from Config.ui

If you're migrating from the previous `config.ui` structure, simply move your UI configuration to the top-level `ui` prop:

### Before (deprecated)
```jsx
<Datatable
  columns={columns}
  records={data}
  config={{
    ui: {
      actionsColWidth: 120,
      showTableHeader: true
    }
  }}
/>
```

### After (current)
```jsx
<Datatable
  columns={columns}
  records={data}
  ui={{
    actionsColWidth: 120,
    showTableHeader: true
  }}
/>
```

The functionality remains exactly the same, with improved organization and cleaner prop structure.
