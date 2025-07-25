import { render, screen } from '@testing-library/react';
//components
import DatatableSearch from './DatatableSearch';

describe('<DatatableSearch />', () => {
  test('renders component name (datatableSearch)', () => {
    render(<DatatableSearch />);
    const title = screen.getByText(/datatableSearch/i);
    expect(title).toBeInTheDocument();
  });
});
