import { render, screen } from '@testing-library/react';
//components
import DropdownClearIcon from './DropdownClearIcon';

describe('<DropdownClearIcon />', () => {
  test('renders component name (dropdownClearIcon)', () => {
    render(<DropdownClearIcon />);
    const title = screen.getByText(/dropdownClearIcon/i);
    expect(title).toBeInTheDocument();
  });
});
