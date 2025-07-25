import { render, screen } from '@testing-library/react';
//components
import DatatableFooter from './DatatableFooter';

describe('<DatatableFooter />', () => {
  test('renders component name (datatableFooter)', () => {
    render(<DatatableFooter />);
    const title = screen.getByText(/datatableFooter/i);
    expect(title).toBeInTheDocument();
  });
});
