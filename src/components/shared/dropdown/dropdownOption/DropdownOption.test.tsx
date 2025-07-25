import { render, screen } from '@testing-library/react';
//components
import DropdownOption from './DropdownOption';

describe('<DropdownOption />', () => {
  test('renders component name (dropdownOption)', () => {
    // render(<DropdownOption />);
    const title = screen.getByText(/dropdownOption/i);
    expect(title).toBeInTheDocument();
  });
});
