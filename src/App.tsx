//error boundary
import { ErrorBoundary } from 'react-error-boundary';
//error boundary fallback
import ErrorBoundaryFallback from '@/components/errorBoundaryFallback/ErrorBoundaryFallback';

const App = () => (
  <ErrorBoundary
    FallbackComponent={ErrorBoundaryFallback}
    onReset={() => {
      //Reset the state of your app so the error doesn't happen again
      console.log('Try again clicked');
    }}
  >
    <h1 style={{ textAlign: 'center' }}>Webpack react boilerplate</h1>
  </ErrorBoundary>
);

export default App;
