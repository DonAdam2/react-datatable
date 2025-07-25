import { render, screen } from '@testing-library/react';
//components
import CustomPagination from './CustomPagination';

describe('<CustomPagination />', () => {
  test('renders component name (customPagination)', () => {
    // render(<CustomPagination />);
    const title = screen.getByText(/customPagination/i);
    expect(title).toBeInTheDocument();
  });
});
