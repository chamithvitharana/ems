import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { AiFillDashboard } from 'react-icons/ai';
import {
  FaCar,
  FaFlag,
  FaPeopleGroup,
  FaRegBell,
  FaUniversalAccess,
} from 'react-icons/fa6';
import { FaUserCircle } from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoSidebarExpand } from 'react-icons/go';

interface ISidebarProps {
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
}

const Sidebar: FC<ISidebarProps> = ({ onToggleSidebar, isSidebarVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  return (
    <Flex
      as="nav"
      flexDir="column"
      zIndex={200}
      position="fixed"
      top={0}
      left={0}
      height="full"
      flexGrow={1}
      width={{ base: isSidebarVisible ? '240px' : '0', md: '300px' }}
      transform={{
        base: isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        md: 'translateX(0)',
      }}
      transition="all 0.3s ease-in-out"
      bg="white"
      mt={{ base: '55.66px', md: '64px' }}
      shadow="md"
      overflow="hidden"
    >
      <Flex justify="center">
        <Flex mt={10} justify="center" flexDir="column" gap={5}>
          <Box hideFrom="md">
            <GoSidebarExpand onClick={() => onToggleSidebar()} />
          </Box>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-dashboard') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-dashboard') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-dashboard')}
          >
            <AiFillDashboard size={24} />
            Dashboard
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-vehicles') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-vehicles') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-vehicles')}
          >
            <FaCar size={20} />
            Manage Vehicles
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-customers') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-customers') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-customers')}
          >
            <FaUserCircle size={24} />
            Manage Customers
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-access') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-access') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-access')}
          >
            <FaUniversalAccess size={24} />
            Access Points
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-notifications') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-notifications') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-notifications')}
          >
            <FaRegBell size={24} />
            Notifications
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-agents') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-agents') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-agents')}
          >
            <FaPeopleGroup size={24} />
            Agent Management
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-transactions') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-transactions') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-transactions')}
          >
            <FaPeopleGroup size={24} />
            Transactions
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={
              isActive('/admin-payment-config') ? 'primary.50' : 'transparent'
            }
            color={
              isActive('/admin-payment-config') ? 'primary.600' : 'inherit'
            }
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-payment-config')}
          >
            <MdOutlinePayment size={24} />
            Payment Config
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderColor="secondary.500"
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-reporting') ? 'primary.50' : 'transparent'}
            color={isActive('/admin-reporting') ? 'primary.600' : 'inherit'}
            _hover={{ bg: 'primary.50', color: 'primary.600' }}
            onClick={() => navigate('/admin-reporting')}
          >
            <FaFlag size={24} />
            Reporting Module
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
