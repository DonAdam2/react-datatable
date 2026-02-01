# Column Ordering Feature

The datatable now supports column ordering functionality, allowing users to reorder columns by dragging and dropping column headers.

## Features

- **Drag and Drop Interface**: Click and drag column headers to reorder them
- **Visual Feedback**: Hover states and dragging indicators for better UX  
- **Selective Reordering**: Only data columns can be reordered (actions and selections columns remain fixed)
- **Custom Configuration**: Flexible configuration options for default order and callbacks
- **Persistent State**: Column order state is maintained during the session
- **Integration Ready**: Works seamlessly with existing column visibility and other features

## Basic Usage

### 1. Enable Column Ordering

Add the `columnOrdering` configuration as a top-level prop:

```tsx
<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    enable: true, // Enable column reordering
  }}
/>
```

### 2. Handle Column Reorder Events

Listen for column reorder events to update your application state:

```tsx
const handleColumnReorder = (fromIndex: number, toIndex: number, newOrder: string[]) => {
  console.log('Column moved from', fromIndex, 'to', toIndex);
  console.log('New column order:', newOrder);
  // Update your application state here
};

<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    enable: true,
    onColumnReorder: handleColumnReorder,
  }}
/>
```

## Configuration Options

### Column Ordering Config

```tsx
interface DatatableColumnOrderingConfigInterface {
  enable?: boolean; // Whether to enable column reordering (default: false)
  onColumnReorder?: (fromIndex: number, toIndex: number, columnOrder: string[]) => void | Promise<void>; // Callback function for reorder events
  persistOrder?: boolean; // Reserved for future use - persistent order across sessions
  defaultColumnOrder?: string[]; // Array of column keys defining the initial order
}
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enable` | `boolean` | `false` | Enable column reordering functionality |
| `onColumnReorder` | `function` | `undefined` | Callback function called when columns are reordered |
| `persistOrder` | `boolean` | `false` | Reserved for future use |
| `defaultColumnOrder` | `string[]` | `undefined` | Array of column keys defining the initial order |

## Examples

### Example 1: Basic Column Ordering

```tsx
<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    enable: true,
  }}
/>
```

### Example 2: Custom Default Order

```tsx
<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    enable: true,
    defaultColumnOrder: ['name', 'email', 'department', 'role'],
  }}
/>
```

### Example 3: With Event Handling

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>([]);

const handleColumnReorder = (fromIndex: number, toIndex: number, newOrder: string[]) => {
  setColumnOrder(newOrder);
  // You could also save this to localStorage or send to your API
  localStorage.setItem('columnOrder', JSON.stringify(newOrder));
};

<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    enable: true,
    onColumnReorder: handleColumnReorder,
  }}
/>
```

### Example 4: Combined with Column Visibility

```tsx
<Datatable
  columns={columns}
  records={data}
  columnOrdering={{
    enable: true,
  }}
  columnVisibility={{
    show: true,
    location: 'titleRow',
    trigger: { label: 'Show/Hide Columns' },
  }}
/>
```

## Visual Indicators

When column ordering is enabled, the following visual cues are provided:

- **Move Icon**: A drag handle icon appears next to the column header text
- **Hover State**: Column headers change background color on hover
- **Dragging State**: The column being dragged becomes semi-transparent
- **Drop Target**: The target column highlights when hovering over it during drag

## Behavior Notes

1. **Fixed Columns**: Actions and selections columns cannot be reordered and remain in their configured positions
2. **Reorderable Columns**: Only regular data columns can be reordered
3. **Index Calculation**: The `onColumnReorder` callback receives indices relative to the reorderable columns only
4. **State Management**: Column order is managed internally and resets when the component unmounts
5. **Drag and Drop**: Uses native HTML5 drag and drop API for cross-browser compatibility

## Integration with Other Features

### Column Visibility
Column ordering works seamlessly with column visibility. Hidden columns are excluded from the ordering but their order is preserved when they become visible again.

### Sorting
Column ordering does not affect sorting functionality. Users can still sort columns after reordering them.

### Actions Column
The actions column position (first or last) is respected and the actions column itself cannot be reordered.

## TypeScript Support

The column ordering functionality is fully typed:

```typescript
import { 
  DatatableColumnOrderingConfigInterface 
} from './components/shared/datatable/Datatable.types';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
}

const columnOrderingConfig: DatatableColumnOrderingConfigInterface = {
  enable: true,
  onColumnReorder: (fromIndex: number, toIndex: number, columnOrder: string[]) => {
    console.log('Reordered columns:', columnOrder);
  },
  defaultColumnOrder: ['name', 'email', 'department'],
};
```

## Best Practices

### 1. Provide Clear Visual Feedback
The default styling provides good visual feedback, but you can customize it further if needed:

```scss
.column-reorderable {
  cursor: move;
  
  &:hover {
    background-color: #f3f4f6;
  }
}
```

### 2. Handle State Appropriately
For better UX, consider persisting column order:

```tsx
const [columnOrder, setColumnOrder] = useState(() => {
  const saved = localStorage.getItem('columnOrder');
  return saved ? JSON.parse(saved) : [];
});

const handleColumnReorder = (fromIndex: number, toIndex: number, newOrder: string[]) => {
  setColumnOrder(newOrder);
  localStorage.setItem('columnOrder', JSON.stringify(newOrder));
};
```

### 3. Combine with Other Features
Column ordering works well with other datatable features:

```tsx
<Datatable
  columns={columns}
  records={data}
  title={{
    titleLabel: 'Employees',
    titleLocation: 'titleRow',
  }}
  columnOrdering={{
    enable: true,
    onColumnReorder: handleColumnReorder,
  }}
  columnVisibility={{
    show: true,
    location: 'titleRow',
  }}
  search={{
    show: true,
  }}
/>
```

## Browser Support

The column ordering feature supports all modern browsers and follows the same compatibility requirements as the rest of the datatable component. It uses the standard HTML5 drag and drop API which is supported in:

- Chrome 4+
- Firefox 3.5+
- Safari 3.1+
- Edge (all versions)
- Internet Explorer 9+ (if needed)

## Migration Guide

If you're upgrading from a previous version:

1. **No Breaking Changes**: The feature is fully backward compatible
2. **Optional Feature**: Column ordering is disabled by default unless explicitly configured
3. **Existing Props**: All existing datatable props continue to work without modification
4. **Type Safety**: All new types are properly exported and typed [[memory:4374326]]
