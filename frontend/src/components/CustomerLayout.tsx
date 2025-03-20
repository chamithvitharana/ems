import { FC, ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import Header from './common/Header';
import { scrollBarCss } from '../common/css';

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout: FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <Flex flexDir="column" bg="secondary.100" height="100vh">
      <Header />
      <Box
        id="scrollableDiv"
        w="full"
        overflowY="auto"
        flexGrow={1}
        xl={{ pb: 20 }}
        css={scrollBarCss}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default CustomerLayout;
