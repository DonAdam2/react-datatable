# Row Events Documentation

This document provides comprehensive information about the row events functionality in the React Datatable component.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Event Types](#event-types)
- [Event Properties](#event-properties)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [TypeScript Support](#typescript-support)

## Overview

Row events allow you to add interactive behavior to datatable rows, including clicking, double-clicking, and drag-and-drop functionality. All row events are configured through the `rowEvents` prop at the top level of the Datatable component.

### Basic Structure

```jsx
<Datatable
  columns={columns}
  records={data}
  rowEvents={{
    onClick: { /* click configuration */ },
    onDoubleClick: { /* double click configuration */ },
    onDragStart: { /* drag start configuration */ },
    onDrop: { /* drop configuration */ },
  }}
/>
```

## Configuration

Row events are configured using the `rowEvents` prop which accepts a `DatatableRowEvents<T>` object:

```typescript
interface DatatableRowEvents<T = Record<string, unknown>> {
  onClick?: ClickEventConfig<T>;
  onDoubleClick?: ClickEventConfig<T>;
  onDragStart?: DragStartEventConfig<T>;
  onDrop?: DropEventConfig<T>;
}
```

## Event Types

### onClick

Handles single click events on table rows.

```jsx
rowEvents={{
  onClick: {
    clickable: true, // or function: (rowInfo) => boolean
    event: (e, rowInfo) => {
      console.log('Row clicked:', rowInfo.original);
    },
  },
}}
```

### onDoubleClick

Handles double click events on table rows.

```jsx
rowEvents={{
  onDoubleClick: {
    clickable: true, // or function: (rowInfo) => boolean
    event: (e, rowInfo) => {
      console.log('Row double-clicked:', rowInfo.original);
    },
  },
}}
```

### onDragStart

Handles drag start events for drag-and-drop functionality.

```jsx
rowEvents={{
  onDragStart: {
    draggable: true, // or function: (rowInfo) => boolean
    icon: <DragIcon />, // optional custom drag icon
    className: 'custom-drag-style', // optional CSS class
    event: (e, rowInfo) => {
      console.log('Drag started:', rowInfo.original);
    },
  },
}}
```

### onDrop

Handles drop events for drag-and-drop functionality.

```jsx
rowEvents={{
  onDrop: {
    droppable: true, // or function: (rowInfo) => boolean
    className: 'custom-drop-zone', // optional CSS class
    event: (e, rowInfo) => {
      console.log('Item dropped on:', rowInfo.original);
    },
  },
}}
```

## Event Properties

### Common Properties

All event configurations support conditional enabling through boolean values or functions:

- **Boolean**: `true` enables for all rows, `false` disables for all rows
- **Function**: `(rowInfo: RowInfo<T>) => boolean` - enables/disables based on row data

### RowInfo Object

The `rowInfo` object passed to event handlers and conditional functions contains:

```typescript
interface RowInfo<T> {
  original: T; // The original row data
  getValue: (key: string) => any; // Function to get nested values
}
```

### Event Handler Signature

All event handlers receive:
1. **e**: The native DOM event (MouseEvent for clicks, DragEvent for drag/drop)
2. **rowInfo**: The RowInfo object containing row data and utilities

## Usage Examples

### Basic Click Handler

```jsx
<Datatable
  columns={columns}
  records={employees}
  rowEvents={{
    onClick: {
      clickable: true,
      event: (e, { original }) => {
        alert(`Clicked on ${original.name}`);
      },
    },
  }}
/>
```

### Conditional Click Based on Row Data

```jsx
<Datatable
  columns={columns}
  records={users}
  rowEvents={{
    onClick: {
      // Only allow clicking on active users
      clickable: ({ getValue }) => 
        getValue('status') === 'active',
      event: (e, { original, getValue }) => {
        console.log(`Active user clicked: ${getValue('name')}`);
      },
    },
  }}
/>
```

### Complete Drag and Drop Setup

```jsx
<Datatable
  columns={columns}
  records={tasks}
  rowEvents={{
    onDragStart: {
      draggable: ({ getValue }) => 
        getValue('status') === 'pending',
      icon: <DragHandleIcon />,
      className: 'draggable-row',
      event: (e, { getValue }) => {
        console.log(`Started dragging task: ${getValue('title')}`);
        // Set drag data
        e.dataTransfer.setData('text/plain', getValue('id'));
      },
    },
    onDrop: {
      droppable: ({ getValue }) => 
        getValue('status') === 'in-progress',
      className: 'drop-zone',
      event: (e, { original, getValue }) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        console.log(`Dropped task ${draggedId} on ${getValue('title')}`);
        // Handle the drop logic
        handleTaskReorder(draggedId, original.id);
      },
    },
  }}
/>
```

### Multiple Event Types

```jsx
<Datatable
  columns={columns}
  records={products}
  rowEvents={{
    onClick: {
      clickable: true,
      event: (e, { original }) => {
        console.log('Single click:', original.name);
      },
    },
    onDoubleClick: {
      clickable: true,
      event: (e, { original }) => {
        // Navigate to product details
        navigate(`/products/${original.id}`);
      },
    },
    onDragStart: {
      draggable: ({ getValue }) => getValue('category') === 'movable',
      event: (e, { original }) => {
        e.dataTransfer.setData('application/json', JSON.stringify(original));
      },
    },
  }}
/>
```

## Advanced Features

### Custom Styling with CSS Classes

Row events support custom CSS classes for visual feedback:

```jsx
rowEvents={{
  onDragStart: {
    draggable: true,
    className: 'my-draggable-row', // Applied to draggable rows
    event: (e, rowInfo) => { /* ... */ },
  },
  onDrop: {
    droppable: true,
    className: 'my-drop-zone', // Applied to droppable rows
    event: (e, rowInfo) => { /* ... */ },
  },
}}
```

```scss
// Custom styles for drag and drop
.my-draggable-row {
  cursor: grab;
  
  &:hover {
    background-color: #f0f8ff;
  }
  
  &.row-dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
}

.my-drop-zone {
  &.row-drag-over {
    background-color: #e8f5e8;
    border: 2px dashed #4caf50;
  }
}
```

### Accessing Nested Data

Use the `getValue` function to access nested object properties:

```jsx
rowEvents={{
  onClick: {
    clickable: ({ getValue }) => {
      // Access nested properties
      const userRole = getValue('user.role');
      const subscriptionStatus = getValue('subscription.status');
      return userRole === 'admin' && subscriptionStatus === 'active';
    },
    event: (e, { getValue }) => {
      console.log('Admin user:', getValue('user.email'));
      console.log('Department:', getValue('user.department.name'));
    },
  },
}}
```

### Integration with State Management

```jsx
const [selectedRows, setSelectedRows] = useState([]);
const [draggedItem, setDraggedItem] = useState(null);

const rowEvents = {
  onClick: {
    clickable: true,
    event: (e, { original }) => {
      // Add to selection with Ctrl+click
      if (e.ctrlKey) {
        setSelectedRows(prev => 
          prev.includes(original.id) 
            ? prev.filter(id => id !== original.id)
            : [...prev, original.id]
        );
      } else {
        setSelectedRows([original.id]);
      }
    },
  },
  onDragStart: {
    draggable: true,
    event: (e, { original }) => {
      setDraggedItem(original);
      e.dataTransfer.effectAllowed = 'move';
    },
  },
  onDrop: {
    droppable: ({ original }) => original.id !== draggedItem?.id,
    event: (e, { original }) => {
      if (draggedItem) {
        // Perform reorder operation
        handleReorder(draggedItem.id, original.id);
        setDraggedItem(null);
      }
    },
  },
};

return <Datatable {...props} rowEvents={rowEvents} />;
```

## Best Practices

### 1. Performance Optimization

- Use `useCallback` for event handlers to prevent unnecessary re-renders:

```jsx
const handleRowClick = useCallback((e, { original }) => {
  console.log('Clicked:', original);
}, []);

const rowEvents = useMemo(() => ({
  onClick: {
    clickable: true,
    event: handleRowClick,
  },
}), [handleRowClick]);
```

### 2. Conditional Logic

- Keep conditional functions simple and fast
- Consider memoizing complex condition calculations
- Use early returns for better readability:

```jsx
const isRowClickable = useCallback(({ getValue }) => {
  const status = getValue('status');
  if (!status) return false;
  
  const role = getValue('user.role');
  if (role === 'guest') return false;
  
  return status === 'active';
}, []);
```

### 3. Error Handling

- Always include error handling in event callbacks:

```jsx
rowEvents={{
  onClick: {
    clickable: true,
    event: (e, { original }) => {
      try {
        // Your click logic here
        handleRowClick(original);
      } catch (error) {
        console.error('Row click error:', error);
        showErrorMessage('Failed to process row click');
      }
    },
  },
}}
```

### 4. Accessibility

- Provide keyboard alternatives for click events
- Use appropriate ARIA attributes
- Consider screen reader users:

```jsx
// Add keyboard support
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.matches('.clickable-row')) {
      // Trigger row click logic
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

### 5. Visual Feedback

- Always provide visual feedback for interactive elements
- Use CSS transitions for smooth interactions
- Ensure sufficient color contrast:

```scss
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:focus {
    outline: 2px solid #007acc;
    outline-offset: -2px;
  }
}
```

## TypeScript Support

The row events system is fully typed with TypeScript. You can specify your data type for better type safety:

```typescript
interface Employee {
  id: number;
  name: string;
  department: {
    id: number;
    name: string;
  };
  status: 'active' | 'inactive';
}

const rowEvents: DatatableRowEvents<Employee> = {
  onClick: {
    clickable: ({ original, getValue }) => {
      // TypeScript knows the types here
      return original.status === 'active';
    },
    event: (e: MouseEvent, { original, getValue }) => {
      // Full type safety for Employee properties
      console.log(original.name); // ✓ TypeScript knows this is a string
      console.log(getValue('department.name')); // ✓ Properly typed
    },
  },
};

<Datatable<Employee>
  columns={columns}
  records={employees}
  rowEvents={rowEvents}
/>
```

### Custom Type Definitions

You can extend the row events interface for custom implementations:

```typescript
import { DatatableRowEvents } from './Datatable.types';

interface CustomRowEvents<T> extends DatatableRowEvents<T> {
  onCustomEvent?: {
    enabled?: boolean | ((rowInfo: RowInfo<T>) => boolean);
    handler: (data: T) => void;
  };
}
```

---

For more examples and advanced usage patterns, check out the [Storybook documentation](../README.md#demo) and the row events stories in the component library.
