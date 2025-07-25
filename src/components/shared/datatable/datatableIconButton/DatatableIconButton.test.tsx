import { render, screen } from '@testing-library/react';
//components
import DatatableIconButton from './DatatableIconButton';

describe('<DatatableIconButton />', () => {
  test('renders component name (datatableIconButton)', () => {
    render(<DatatableIconButton />);
    const title = screen.getByText(/datatableIconButton/i);
    expect(title).toBeInTheDocument();
  });
});
