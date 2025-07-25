import { render, screen } from '@testing-library/react';
//components
import DatatableCheckbox from './DatatableCheckbox';

describe('<DatatableCheckbox />', () => {
  test('renders component name (datatableCheckbox)', () => {
    // render(<DatatableCheckbox />);
    const title = screen.getByText(/datatableCheckbox/i);
    expect(title).toBeInTheDocument();
  });
});
