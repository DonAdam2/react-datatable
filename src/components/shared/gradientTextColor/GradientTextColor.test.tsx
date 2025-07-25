import { render, screen } from '@testing-library/react';
//components
import GradientTextColor from './GradientTextColor';

describe('<GradientTextColor />', () => {
  test('renders component name (gradientTextColor)', () => {
    // render(<GradientTextColor />);
    const title = screen.getByText(/gradientTextColor/i);
    expect(title).toBeInTheDocument();
  });
});
