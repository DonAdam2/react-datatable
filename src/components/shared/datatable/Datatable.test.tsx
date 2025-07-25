import { render, screen } from '@testing-library/react';
//components
import Datatable from './Datatable';

describe('<Datatable />', () => {
  test('renders component name (datatable)', () => {
    // render(<Datatable />);
    const title = screen.getByText(/datatable/i);
    expect(title).toBeInTheDocument();
  });
});
