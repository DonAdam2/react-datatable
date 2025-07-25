import { render, screen } from '@testing-library/react';
//components
import DropdownSelectedOption from './DropdownSelectedOption';

describe('<DropdownSelectedOption />', () => {
  test('renders component name (dropdownSelectedOption)', () => {
    render(<DropdownSelectedOption />);
    const title = screen.getByText(/dropdownSelectedOption/i);
    expect(title).toBeInTheDocument();
  });
});
