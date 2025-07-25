import { render, screen } from '@testing-library/react';
//components
import DropdownSearchInput from './DropdownSearchInput';

describe('<DropdownSearchInput />', () => {
  test('renders component name (dropdownSearchInput)', () => {
    render(<DropdownSearchInput />);
    const title = screen.getByText(/dropdownSearchInput/i);
    expect(title).toBeInTheDocument();
  });
});
