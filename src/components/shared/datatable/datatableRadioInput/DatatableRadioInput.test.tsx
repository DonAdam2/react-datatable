import { render, screen } from '@testing-library/react';
//components
import DatatableRadioInput from './DatatableRadioInput';

describe('<DatatableRadioInput />', () => {
  test('renders component name (datatableRadioInput)', () => {
    // render(<DatatableRadioInput />);
    const title = screen.getByText(/datatableRadioInput/i);
    expect(title).toBeInTheDocument();
  });
});
