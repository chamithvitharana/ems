import { FC, ReactNode, useEffect } from 'react';
import { Center, Flex, Spinner } from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { useNavigate, useLocation } from 'react-router-dom';
import { scrollBarCss } from '../common/css';
import { useAuth } from '../hooks/useAuth';

interface AuthLayoutProps {
  children: ReactNode;
  width?: string;
}

const AuthLayout: FC<AuthLayoutProps> = ({ width, children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/home') {
      toaster.create({
        description: 'Already logged in',
        type: 'info',
      });
      navigate('/home');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (isAuthenticated === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isAuthenticated) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center
      backgroundImage="linear-gradient(to bottom, rgba(241, 245, 249, 0.7), rgba(241, 245, 249, 0.9)), url(/assets/expressway.png)"
      backgroundSize="cover"
      backgroundPosition="center"
      height="100vh"
      p={5}
    >
      <Flex
        justify="center"
        background="white"
        w={width ? width : '30rem'}
        md={{ minW: '30rem' }}
        minH="30rem"
        borderRadius="2xl"
        shadow="md"
        py={5}
        px={8}
        overflowY="auto"
        maxH="100%"
        css={scrollBarCss}
      >
        {children}
      </Flex>
    </Center>
  );
};

export default AuthLayout;
