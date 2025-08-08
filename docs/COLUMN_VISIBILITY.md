# Column Visibility Feature

The datatable now supports column visibility functionality, allowing users to show/hide columns dynamically through a dropdown interface, similar to shadcn's data table implementation.

## Features

- **Dropdown Interface**: Uses your existing dropdown component for consistent UI
- **Checkbox Selection**: Multi-select checkboxes for toggling column visibility
- **Selective Hiding**: Only columns marked as `enableHiding` can be toggled
- **Persistent State**: Column visibility state is maintained during the session
- **Search Integration**: Search functionality respects visible columns only
- **Custom Configuration**: Flexible configuration options for default visibility

## Basic Usage

### 1. Enable Column Visibility

Add the `columnVisibility` configuration as a top-level prop:

```tsx
<Datatable
  columns={columns}
  records={data}
  columnVisibility={{
    show: true, // Show the toggle button
  }}
/>
```

### 2. Configure Column Hideability

Mark columns as enableHiding in your column definitions:

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableHiding: true, // Can be hidden
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableHiding: true, // Can be hidden
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false, // Always visible
  },
];
```

## Configuration Options

### Column Visibility Config

```tsx
interface DatatableColumnVisibilityConfigInterface {
  show?: boolean; // Whether to show the toggle button (default: true)
  trigger?: ButtonInterface; // Custom button configuration for the toggle
  defaultVisibleColumns?: string[]; // Array of column keys that should be visible by default
  hiddenColumns?: string[]; // Array of column keys that should be hidden by default
}
```

### Column Definition

Add the `enableHiding` property to your column definitions:

```tsx
interface ColumnDef<T = Record<string, any>> {
  accessorKey: keyof T | string | 'action';
  header?: ReactNode;
  enableHiding?: boolean; // Whether this column can be hidden (default: true)
  // ... other properties
}
```

## Examples

### Example 1: Default Behavior

```tsx
<Datatable
  columns={columns}
  records={data}
  columnVisibility={{
    show: true,
  }}
/>
```

All columns with `enableHiding: true` (or undefined) will be visible by default.

### Example 2: Custom Default Visibility

```tsx
<Datatable
  columns={columns}
  records={data}
  columnVisibility={{
    show: true,
    trigger: {
      label: 'Show/Hide Columns',
      isOutlined: true,
    },
    defaultVisibleColumns: ['name', 'email', 'status'], // Only these columns visible by default
  }}
/>
```

### Example 3: Hide Specific Columns by Default

```tsx
<Datatable
  columns={columns}
  records={data}
  columnVisibility={{
    show: true,
    hiddenColumns: ['phone', 'department'], // These columns hidden by default
  }}
/>
```

## Advanced Configuration

### Integration with Title Area

The column visibility toggle automatically integrates with the datatable's title area:

```tsx
<Datatable
  columns={columns}
  records={data}
  title={{
    titleLabel: 'Users Table',
    titleLocation: 'titleRow', // Column toggle will appear in title row
    titleButtons: [
      // Your custom buttons
    ],
  }}
  columnVisibility={{
    show: true,
  }}
/>
```

### Styling

The component uses your existing dropdown component, so styling follows the same patterns as other dropdowns in your application. You can customize the trigger appearance by targeting the `.column-visibility-trigger` class if needed.

## Important Notes

1. **Hideable Property**: By default, all columns are hideable unless explicitly set to `enableHiding: false`
2. **Always Visible Columns**: Columns with `enableHiding: false` will never appear in the visibility dropdown
3. **Search Integration**: The search functionality automatically adapts to search only within visible columns
4. **State Management**: Column visibility state is managed internally and resets when the component unmounts
5. **Performance**: The feature uses efficient filtering to avoid unnecessary re-renders

## Migration Guide

If you're upgrading from a previous version:

1. **No Breaking Changes**: The feature is fully backward compatible
2. **Optional Feature**: Column visibility is disabled by default unless explicitly configured
3. **Column Definitions**: Existing column definitions work without modification
4. **Type Safety**: All new types are properly exported and typed [[memory:4374326]]

## Browser Support

The column visibility feature supports all modern browsers and follows the same compatibility requirements as the rest of the datatable component. 