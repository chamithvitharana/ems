import React from 'react';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { FaCar } from 'react-icons/fa6';
import { FaUniversalAccess, FaUser } from 'react-icons/fa';
import { TbCircleLetterR } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import {
  getAdminAccessPoints,
  getAdminCustomers,
  getAdminVehicles,
  getMapData,
  getOngoingVehicles,
} from '../../services/admin';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { ILocation } from '../../common/interfaces';

const AdminDashboard = () => {
  const { data: onGoingVehicles } = useQuery({
    queryKey: ['ongoingVehicles'],
    queryFn: () => getOngoingVehicles(),
  });
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getAdminCustomers(0, 1, ''),
  });
  const { data: accessPoints } = useQuery({
    queryKey: ['adminAccessPoint'],
    queryFn: () => getAdminAccessPoints(0, 1, ''),
  });
  const { data: vehicles } = useQuery({
    queryKey: ['adminVehicles'],
    queryFn: () => getAdminVehicles(0, 1, ''),
  });
  const { data: mapMarkers, isSuccess } = useQuery({
    queryKey: ['mapMarkers'],
    queryFn: () => getMapData(),
  });

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <Flex flexDir="column">
        <Grid
          templateColumns={{ base: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' }}
          gap={5}
        >
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              Ongoing Vehicles
            </Text>
            <Flex
              mt={2}
              borderWidth={1}
              borderColor="secondary.500"
              borderRadius="md"
              p={3}
              gap={5}
              alignItems="center"
              justify="center"
            >
              <FaCar size={32} />
              <Text fontWeight="bold">{onGoingVehicles?.data || 0}</Text>
            </Flex>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              Active Customers
            </Text>
            <Flex
              mt={2}
              borderWidth={1}
              borderColor="secondary.500"
              borderRadius="md"
              p={3}
              gap={5}
              alignItems="center"
              justify="center"
            >
              <FaUser size={32} />
              <Text fontWeight="bold">
                {customers?.data?.totalElements || 0}
              </Text>
            </Flex>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              Access Points
            </Text>
            <Flex
              mt={2}
              borderWidth={1}
              borderColor="secondary.500"
              borderRadius="md"
              p={3}
              gap={5}
              alignItems="center"
              justify="center"
            >
              <FaUniversalAccess size={32} />
              <Text fontWeight="bold">
                {accessPoints?.data?.totalElements || 0}
              </Text>
            </Flex>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold">
              Registered Vehicles
            </Text>
            <Flex
              mt={2}
              borderWidth={1}
              borderColor="secondary.500"
              borderRadius="md"
              p={3}
              gap={5}
              alignItems="center"
              justify="center"
            >
              <TbCircleLetterR size={32} />
              <Text fontWeight="bold">
                {vehicles?.data?.totalElements || 0}
              </Text>
            </Flex>
          </Box>
        </Grid>
        <Box mt={12} h={'500px'}>
          <MapContainer
            center={[6.6, 80.38]}
            zoom={9}
            scrollWheelZoom={false}
            style={{ height: '500px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {isSuccess &&
              mapMarkers?.data.map((map: ILocation, index: number) => (
                <Marker key={index} position={[map.lat, map.lon]}>
                  <Tooltip
                    direction="top"
                    offset={[-15, -15]}
                    opacity={1}
                    permanent
                  >
                    {map.count.toString()}
                  </Tooltip>
                </Marker>
              ))}
          </MapContainer>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminDashboard;
