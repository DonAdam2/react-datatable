import { render, screen } from '@testing-library/react';
//components
import ClickAwayWrapper from './ClickAwayWrapper';

describe('<ClickAwayWrapper />', () => {
  test('renders component name (clickAwayWrapper)', () => {
    // render(<ClickAwayWrapper />);
    const title = screen.getByText(/clickAwayWrapper/i);
    expect(title).toBeInTheDocument();
  });
});
