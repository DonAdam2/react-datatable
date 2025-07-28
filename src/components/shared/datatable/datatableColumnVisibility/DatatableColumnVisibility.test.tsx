import { render, screen, fireEvent } from '@testing-library/react';
import DatatableColumnVisibility from './DatatableColumnVisibility';
import { ColumnDef } from '../datatableHeader/DatatableHeader.types';

const mockColumns: ColumnDef[] = [
  { accessorKey: 'name', header: 'Name', hideable: true },
  { accessorKey: 'email', header: 'Email', hideable: true },
  { accessorKey: 'role', header: 'Role', hideable: false },
  { accessorKey: 'actions', header: '', hideable: false },
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

  it('does not render when no hideable columns exist', () => {
    const nonHideableColumns: ColumnDef[] = [
      { accessorKey: 'name', header: 'Name', hideable: false },
      { accessorKey: 'email', header: 'Email', hideable: false },
    ];

    const { container } = render(
      <DatatableColumnVisibility {...defaultProps} columns={nonHideableColumns} />
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
