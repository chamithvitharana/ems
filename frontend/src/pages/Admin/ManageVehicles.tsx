import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Flex, HStack, Input, Table, Text } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import ViewModal from './components/ViewModal';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import { debounce } from 'lodash';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { changeVehicleStatus, getAdminVehicles } from '../../services/admin';
import Pagination from '../../components/common/Pagination';
import { IStatusPayload, IVehicle } from '../../common/interfaces';
import { toaster } from '../../components/ui/toaster';
import { FaEye } from 'react-icons/fa6';
import { Switch } from '../../components/ui/switch';

const ManageVehicles = () => {
  const queryClient = useQueryClient();
  const [openViewDialog, setOpenViewModal] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminVehicles', searchTerm, page, pageSize],
    queryFn: () => getAdminVehicles(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: (data: IStatusPayload) => changeVehicleStatus(data),
    onSuccess: () => {
      toaster.create({
        description: 'Status updated successfully!',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['adminVehicles'] });
    },
    onError: (error) => {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    },
  });

  const toggleViewDialog = () => {
    setOpenViewModal((prev) => !prev);
  };

  const onToggleStatus = () => {
    if (selectedVehicle) {
      mutation.mutate({
        id: selectedVehicle.id,
        status: selectedVehicle.status === 'ACTIVE' ? false : true,
      });
    }
  };

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

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
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
      <Box h="calc(100vh - 350px)" overflow="hidden">
        <Table.ScrollArea
          borderWidth="1px"
          rounded="md"
          maxH="full"
          maxW={{ mdDown: 'fit' }}
          css={scrollBarCss}
        >
          <Table.Root size="md" showColumnBorder striped stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.emphasized">
                <Table.ColumnHeader fontWeight="bold">ID</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Registration Number
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Manufactured Year
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Registered Year
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Vehicle Type
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Brand</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Fuel Type
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.content?.map((item: IVehicle) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.registrationNumber}</Table.Cell>
                  <Table.Cell>{item.manufacturedYear}</Table.Cell>
                  <Table.Cell>{item.registeredYear}</Table.Cell>
                  <Table.Cell>{item.vehicleType.name}</Table.Cell>
                  <Table.Cell>{item.brand.name}</Table.Cell>
                  <Table.Cell>{item.fuelType.name}</Table.Cell>
                  <Table.Cell>
                    <Switch
                      onClick={() => {
                        setSelectedVehicle(item);
                        onToggleStatus();
                      }}
                      checked={item.status === 'ACTIVE'}
                      colorPalette={'green'}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Flex
                      justifyContent={'center'}
                      alignItems={'center'}
                      gap={2}
                    >
                      <Flex
                        justify={'center'}
                        alignItems={'center'}
                        bg="primary.100"
                        borderWidth={1}
                        w={'fit'}
                        p={0.5}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        onClick={() => {
                          setSelectedVehicle(item);
                          toggleViewDialog();
                        }}
                      >
                        <FaEye />
                      </Flex>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
      {isSuccess && data?.data?.totalPages > 0 && (
        <Flex justifyContent={'end'} mt={2}>
          <Pagination
            handlePageClick={handlePageClick}
            total={Math.ceil(data?.data?.totalElements / pageSize)}
          />
        </Flex>
      )}
      <ViewModal
        open={openViewDialog}
        confirm={() => toggleViewDialog()}
        title="View Vehicle"
        body={
          <Flex flexDir="column" gap={3}>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Registration Number:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedVehicle?.registrationNumber}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Manufactured Year:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedVehicle?.manufacturedYear}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Registered Year:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedVehicle?.registeredYear}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Vehicle Type:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedVehicle?.vehicleType.name}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Brand:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedVehicle?.brand.name}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Fuel Type:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedVehicle?.fuelType.name}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Status:
              </Text>
              <Text
                color={selectedVehicle?.status ? 'green.600' : 'red.600'}
                fontSize="sm"
                fontWeight="bold"
              >
                {selectedVehicle?.status ? 'Active' : 'Inactive'}
              </Text>
            </Flex>
          </Flex>
        }
      />
    </Box>
  );
};

export default ManageVehicles;
