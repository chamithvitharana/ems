import { FC } from 'react';
import { Box, Flex, Grid, Separator, Text } from '@chakra-ui/react';
import { IVehicle } from '../../../common/interfaces';
import { Button } from '../../../components/ui/button';
import { BsThreeDots } from 'react-icons/bs';
import {
  MenuRoot,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from '../../../components/ui/menu';
import { useNavigate } from 'react-router-dom';
import { downloadBase64Image } from '../../../common/functions';

const VehicleCard: FC<IVehicle> = ({
  brand,
  fuelType,
  id,
  manufacturedYear,
  registeredYear,
  vehicleType,
  registrationNumber,
  qrCode,
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      bg="white"
      borderRadius="lg"
      p={5}
      flexDir="column"
      shadow="md"
      _hover={{ shadow: 'lg' }}
    >
      <Flex justify="space-between" alignItems="center">
        <Text color="gray.400" fontSize="xs" fontWeight="medium">
          {brand.name}
        </Text>
        <MenuRoot>
          <MenuTrigger asChild>
            <BsThreeDots cursor="pointer" />
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              value="update"
              _hover={{ bg: 'bg.info', color: 'fg.info' }}
              onClick={() => navigate(`/vehicles/update/${registrationNumber}`)}
            >
              Update
            </MenuItem>
            {/* <MenuItem
              value="remove"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
              onClick={() => toggleRemoveDialog()}
            >
              Remove
            </MenuItem> */}
          </MenuContent>
        </MenuRoot>
      </Flex>
      <Text mb={1} fontSize="xl" fontWeight="bold">
        {registrationNumber}
      </Text>
      <Separator />
      <Grid mt={3} gap={3} templateColumns="repeat(2, 1fr)">
        <Box p={2} borderWidth={1} borderColor="gray.300" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold">
            {manufacturedYear}
          </Text>
          <Text fontWeight="medium" color="gray.400" fontSize="xs">
            Manufactured Year
          </Text>
        </Box>
        <Box p={2} borderWidth={1} borderColor="gray.300" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold">
            {registeredYear}
          </Text>
          <Text fontWeight="medium" color="gray.400" fontSize="xs">
            Registered Year
          </Text>
        </Box>
        <Box p={2} borderWidth={1} borderColor="gray.300" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold">
            {vehicleType.name}
          </Text>
          <Text fontWeight="medium" color="gray.400" fontSize="xs">
            Vehicle Type
          </Text>
        </Box>
        <Box p={2} borderWidth={1} borderColor="gray.300" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" textTransform="capitalize">
            {fuelType.name}
          </Text>
          <Text fontWeight="medium" color="gray.400" fontSize="xs">
            Fuel Type
          </Text>
        </Box>
      </Grid>
      <Button
        onClick={() => downloadBase64Image(qrCode!, registrationNumber)}
        colorPalette="cyan"
        mt={3}
      >
        Download QR
      </Button>
    </Flex>
  );
};

export default VehicleCard;
