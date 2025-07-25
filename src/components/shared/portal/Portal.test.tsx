import { render, screen } from '@testing-library/react';
//components
import Portal from './Portal';

describe('<Portal />', () => {
  test('renders component name (portal)', () => {
    // render(<Portal />);
    const title = screen.getByText(/portal/i);
    expect(title).toBeInTheDocument();
  });
});
