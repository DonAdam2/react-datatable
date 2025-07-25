import { render, screen } from '@testing-library/react';
//components
import Tooltip from './Tooltip';

describe('<Tooltip />', () => {
  test('renders component name (tooltip)', () => {
    render(<Tooltip />);
    const title = screen.getByText(/tooltip/i);
    expect(title).toBeInTheDocument();
  });
});
