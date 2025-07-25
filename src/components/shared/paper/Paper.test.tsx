import { render, screen } from '@testing-library/react';
//components
import Paper from './Paper';

describe('<Paper />', () => {
  test('renders component name (paper)', () => {
    render(<Paper />);
    const title = screen.getByText(/paper/i);
    expect(title).toBeInTheDocument();
  });
});
