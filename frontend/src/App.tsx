import { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';
import { Toaster } from './components/ui/toaster';
import { system } from './theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const queryClient = new QueryClient();
const stripePromise = loadStripe(
  'pk_test_51QWGP7Jqz2qlkGLgMWDcRscKWsMb6pIQmOGSRXvAIeqkTlHTSV1HtdBrb5QNhVnw9RJ3rA2tac7bzWnDLb5N4fQw00lNiV9Bt6',
);

const App: FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider value={system}>
            <Toaster />
            <RouterProvider router={router} />
          </ChakraProvider>
        </QueryClientProvider>
      </Provider>
    </Elements>
  );
};

export default App;
