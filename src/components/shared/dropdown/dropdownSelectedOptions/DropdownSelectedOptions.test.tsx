import { render, screen } from '@testing-library/react';
import DropdownSelectedOptions from '@/components/shared/dropdown/dropdownSelectedOptions/DropdownSelectedOptions';

describe('<DropdownSelectedOptions />', () => {
  test('renders component name (dropdownSelectedOptions)', () => {
    // render(<DropdownSelectedOptions />);
    const title = screen.getByText(/dropdownSelectedOptions/i);
    expect(title).toBeInTheDocument();
  });
});
