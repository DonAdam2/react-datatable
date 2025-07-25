import { render, screen } from '@testing-library/react';
//components
import DatatableHeader from './DatatableHeader';

describe('<DatatableHeader />', () => {
  test('renders component name (datatableHeader)', () => {
    // render(<DatatableHeader />);
    const title = screen.getByText(/datatableHeader/i);
    expect(title).toBeInTheDocument();
  });
});
