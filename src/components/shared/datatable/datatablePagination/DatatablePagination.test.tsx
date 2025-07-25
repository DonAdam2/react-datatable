import { render, screen } from '@testing-library/react';
//components
import DatatablePagination from './DatatablePagination';

describe('<DatatablePagination />', () => {
  test('renders component name (datatablePagination)', () => {
    render(<DatatablePagination />);
    const title = screen.getByText(/datatablePagination/i);
    expect(title).toBeInTheDocument();
  });
});
