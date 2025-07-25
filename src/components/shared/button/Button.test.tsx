import { render, screen } from '@testing-library/react';
//components
import Button from './Button';

describe('<Button />', () => {
  test('renders component name (button)', () => {
    render(<Button />);
    const title = screen.getByText(/button/i);
    expect(title).toBeInTheDocument();
  });
});
