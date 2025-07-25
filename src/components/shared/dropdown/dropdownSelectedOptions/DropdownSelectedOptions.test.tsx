import { render, screen } from '@testing-library/react';
//components
import DropdownSelectedOptions from './DropdownSelectedOptions.types';

describe('<DropdownSelectedOptions />', () => {
  test('renders component name (dropdownSelectedOptions)', () => {
    render(<DropdownSelectedOptions />);
    const title = screen.getByText(/dropdownSelectedOptions/i);
    expect(title).toBeInTheDocument();
  });
});
