import { render, screen } from '@testing-library/react';
//components
import DatatableBodyRow from './DatatableBodyRow';

describe('<DatatableBodyRow />', () => {
  test('renders component name (datatableBodyRow)', () => {
    // render(<DatatableBodyRow />);
    const title = screen.getByText(/datatableBodyRow/i);
    expect(title).toBeInTheDocument();
  });
});
