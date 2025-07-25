import { render, screen } from '@testing-library/react';
//components
import DatatableTitleAndSearch from './DatatableTitleAndSearch';

describe('<DatatableTitleAndSearch />', () => {
  test('renders component name (datatableTitleAndSearch)', () => {
    render(<DatatableTitleAndSearch />);
    const title = screen.getByText(/datatableTitleAndSearch/i);
    expect(title).toBeInTheDocument();
  });
});
