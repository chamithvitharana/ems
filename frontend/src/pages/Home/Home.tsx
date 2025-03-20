import React from 'react';
import { Center, Flex } from '@chakra-ui/react';
import { FaCar, FaCarOn, FaRegBell } from 'react-icons/fa6';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaUser } from 'react-icons/fa';
import DashboardButton from './components/DashboardButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const { getRole } = useAuth();
  const navigate = useNavigate();

  const role = getRole();

  return (
    <Flex h="full" flexDir="column">
      <Center flexDir="column" gap={8} lg={{ gap: 14 }} flexGrow={1}>
        <Flex flexDir="column" gap={8} lg={{ flexDir: 'row', gap: 20 }}>
          {role === 'CUSTOMER' && (
            <DashboardButton
              name="Manage Vehicles"
              Icon={<FaCar />}
              onClick={() => navigate('/vehicles')}
            />
          )}
          <DashboardButton
            name="Notifications"
            Icon={<FaRegBell />}
            onClick={() => navigate('/notifications')}
          />
          {role === 'AGENT' && (
            <DashboardButton
              name="Make a Trip"
              Icon={<FaCarOn />}
              onClick={() => navigate('/trips')}
            />
          )}
          <DashboardButton
            name="Live Chat"
            Icon={<IoChatbubbleEllipses />}
            onClick={() => navigate('/chat')}
          />
        </Flex>
        <Flex flexDir="column" gap={8} lg={{ flexDir: 'row', gap: 20 }}>
          {role === 'CUSTOMER' && (
            <DashboardButton
              name="My Transactions"
              Icon={<GiHamburgerMenu />}
              onClick={() => navigate('/transactions')}
            />
          )}
          {role === 'CUSTOMER' && (
            <DashboardButton
              name="Update Profile"
              onClick={() => navigate('/update-profile')}
              Icon={<FaUser />}
            />
          )}
          {role === 'CUSTOMER' && (
            <DashboardButton
              name="Breakdowns"
              onClick={() => navigate('/report-breakdown')}
              Icon={<FaUser />}
            />
          )}
        </Flex>
      </Center>
    </Flex>
  );
};

export default Home;
