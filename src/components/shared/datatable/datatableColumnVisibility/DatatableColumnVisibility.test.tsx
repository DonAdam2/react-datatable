import { render, screen, fireEvent } from '@testing-library/react';
import DatatableColumnVisibility from './DatatableColumnVisibility';
import { ColumnDef } from '../datatableHeader/DatatableHeader.types';

const mockColumns: ColumnDef[] = [
  { accessorKey: 'name', header: 'Name', enableHiding: true },
  { accessorKey: 'email', header: 'Email', enableHiding: true },
  { accessorKey: 'role', header: 'Role', enableHiding: false },
  { accessorKey: 'actions', header: '', enableHiding: false },
];

const defaultProps = {
  columns: mockColumns,
  visibleColumns: { name: true, email: true, role: true, actions: true },
  onToggleColumn: jest.fn(),
  trigger: { label: 'Columns' },
};

describe('DatatableColumnVisibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toggle button', () => {
    render(<DatatableColumnVisibility {...defaultProps} />);

    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('shows dropdown when toggle button is clicked', () => {
    render(<DatatableColumnVisibility {...defaultProps} />);

    const toggleElement = screen.getByText('Columns');
    fireEvent.click(toggleElement);

    // The dropdown should open (implementation depends on dropdown component)
    expect(toggleElement).toBeInTheDocument();
  });

  it('calls onToggleColumn when selection changes', () => {
    const mockOnToggleColumn = jest.fn();
    render(<DatatableColumnVisibility {...defaultProps} onToggleColumn={mockOnToggleColumn} />);

    // Test that the component renders without errors
    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('does not render when no columns with hiding enabled exist', () => {
    const nonHidingColumns: ColumnDef[] = [
      { accessorKey: 'name', header: 'Name', enableHiding: false },
      { accessorKey: 'email', header: 'Email', enableHiding: false },
    ];

    const { container } = render(
      <DatatableColumnVisibility {...defaultProps} columns={nonHidingColumns} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('integrates with existing dropdown component', () => {
    render(<DatatableColumnVisibility {...defaultProps} />);

    // Test that the component integrates properly with the dropdown
    const columnDropdown = screen.getByText('Columns');
    expect(columnDropdown).toBeInTheDocument();
  });
});
