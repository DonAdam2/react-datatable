import { render, screen } from '@testing-library/react';
//components
import ConditionalWrapper from './ConditionalWrapper';

describe('<ConditionalWrapper />', () => {
  test('renders component name (conditionalWrapper)', () => {
    render(<ConditionalWrapper />);
    const title = screen.getByText(/conditionalWrapper/i);
    expect(title).toBeInTheDocument();
  });
});
