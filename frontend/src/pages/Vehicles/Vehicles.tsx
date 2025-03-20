import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import {
  Box,
  Center,
  Grid,
  HStack,
  Input,
  Separator,
  Text,
} from '@chakra-ui/react';
import VehicleCard from './components/VehicleCard';
import { Button } from '../../components/ui/button';
import { IoSearchOutline } from 'react-icons/io5';
import { InputGroup } from '../../components/ui/input-group';
import { BsPlus } from 'react-icons/bs';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getVehicles } from '../../services/vehicles';
import { IVehicle } from '../../common/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Vehicles = () => {
  const { getUser } = useAuth();

  const currentUser = getUser();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['vehicles', searchTerm],
      queryFn: ({ pageParam }) =>
        getVehicles(pageParam - 1, 6, searchTerm, currentUser?.email!),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages, lastPageParam) =>
        lastPage.data.totalElements > 0 ? lastPageParam + 1 : undefined,
    });

  const vehicles: IVehicle[] = isSuccess
    ? data.pages.flatMap((page) => page.data.content)
    : [];

  const debounceOnSearch = useRef(
    debounce((value) => setSearchTerm(value), 500),
  ).current;

  useEffect(() => {
    return () => {
      debounceOnSearch.cancel();
    };
  }, [debounceOnSearch]);

  const handleSearchDisplayChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchDisplay(value);
      debounceOnSearch(value);
    },
    [debounceOnSearch],
  );

  return (
    <Box lgDown={{ p: 5 }} lg={{ px: 28, py: 12 }} xl={{ px: 32, py: 12 }}>
      <Text
        hideFrom="md"
        textAlign="center"
        fontSize="3xl"
        fontWeight="bold"
        mb={5}
      >
        Manage Vehicles
      </Text>
      <HStack
        alignItems="center"
        justify={{ base: 'flex-end', md: 'space-between' }}
        mb={5}
      >
        <Text
          hideBelow="md"
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
        >
          Manage Vehicles
        </Text>
        <Button onClick={() => navigate('create')} colorPalette="primary">
          <BsPlus /> Register New Vehicle
        </Button>
      </HStack>
      <HStack mb={5}>
        <InputGroup flex="1" startElement={<IoSearchOutline />}>
          <Input
            id="search"
            name="search"
            placeholder="Search vehicles..."
            value={searchDisplay}
            onChange={handleSearchDisplayChange}
            bg="white"
            borderColor="secondary.200"
            shadow="md"
            _focus={{ borderColor: 'none', outline: 'none' }}
          />
        </InputGroup>
      </HStack>
      <InfiniteScroll
        dataLength={vehicles.length}
        next={() => !isFetchingNextPage && fetchNextPage()}
        hasMore={hasNextPage}
        loader={
          isFetchingNextPage && (
            <Text mt={5} textAlign="center">
              Loading...
            </Text>
          )
        }
        endMessage={
          <Center mt={5}>
            <Separator w={20} size="md" />
          </Center>
        }
        scrollableTarget="scrollableDiv"
        scrollThreshold={0.5}
      >
        <Grid
          templateColumns={{
            base: 'repeat(auto-fit, minmax(17rem, 1fr))',
            sm: 'repeat(auto-fit, minmax(20rem, 1fr))',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={8}
        >
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              id={vehicle.id}
              brand={vehicle.brand}
              fuelType={vehicle.fuelType}
              vehicleType={vehicle.vehicleType}
              manufacturedYear={vehicle.manufacturedYear}
              registeredYear={vehicle.registeredYear}
              registrationNumber={vehicle.registrationNumber}
              qrCode={vehicle.qrCode}
            />
          ))}
        </Grid>
        {isSuccess && vehicles.length === 0 && (
          <Center mt={20} w="full">
            <Text textAlign="center" fontSize="2xl" fontWeight="bold">
              No Vehicles Found
            </Text>
          </Center>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default Vehicles;
