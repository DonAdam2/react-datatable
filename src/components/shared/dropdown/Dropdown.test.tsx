import { render, screen } from '@testing-library/react';
//components
import Dropdown from './Dropdown';

describe('<Dropdown />', () => {
  test('renders component name (dropdown)', () => {
    // render(<Dropdown />);
    const title = screen.getByText(/dropdown/i);
    expect(title).toBeInTheDocument();
  });
});
