import { render, screen } from '@testing-library/react';
//components
import DatatableTitle from './DatatableTitle';

describe('<DatatableTitle />', () => {
  test('renders component name (datatableTitle)', () => {
    render(<DatatableTitle />);
    const title = screen.getByText(/datatableTitle/i);
    expect(title).toBeInTheDocument();
  });
});
