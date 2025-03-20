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
import { changeCustomerStatus, getAdminCustomers } from '../../services/admin';
import { ICustomer, IStatusPayload } from '../../common/interfaces';
import { toaster } from '../../components/ui/toaster';
import Pagination from '../../components/common/Pagination';
import { FaEye } from 'react-icons/fa6';
import { Switch } from '../../components/ui/switch';

const ManageCustomers = () => {
  const queryClient = useQueryClient();

  const [openViewDialog, setOpenViewModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminCustomers', searchTerm, page, pageSize],
    queryFn: () => getAdminCustomers(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: (data: IStatusPayload) => changeCustomerStatus(data),
    onSuccess: () => {
      toaster.create({
        description: 'Status updated successfully!',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
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
    if (selectedCustomer) {
      mutation.mutate({
        id: selectedCustomer.id,
        status: selectedCustomer.status === 'ACTIVE' ? false : true,
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
            placeholder="Search customers..."
            value={searchDisplay}
            onChange={handleSearchDisplayChange}
            bg="white"
            borderColor="secondary.200"
            shadow="md"
            _focus={{ borderColor: 'none', outline: 'none' }}
          />
        </InputGroup>
      </HStack>
      <Box h="calc(100vh - 250px)" overflow="hidden">
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
                <Table.ColumnHeader fontWeight="bold">Name</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Contact Number
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Email</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Address
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">NIC</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                data?.data?.content?.map((item: ICustomer) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.contactNumber}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.addressLine1}</Table.Cell>
                    <Table.Cell>{item.nic || 'N/A'}</Table.Cell>{' '}
                    <Table.Cell>
                      <Switch
                        onClick={() => {
                          setSelectedCustomer(item);
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
                            setSelectedCustomer(item);
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
        title="View Customer"
        body={
          <Flex flexDir="column" gap={3}>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Name:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedCustomer?.name}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Contact Number:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedCustomer?.contactNumber}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Email
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedCustomer?.email}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Address
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedCustomer?.addressLine1}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Birthday
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedCustomer?.birthday || 'N/A'}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Status
              </Text>
              <Text
                color={selectedCustomer?.status ? 'green.600' : 'red.600'}
                fontSize="sm"
                fontWeight="bold"
              >
                {selectedCustomer?.status ? 'Active' : 'Inactive'}
              </Text>
            </Flex>
          </Flex>
        }
      />
    </Box>
  );
};

export default ManageCustomers;
