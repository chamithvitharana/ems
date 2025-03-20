import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Flex, HStack, Input, Table } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import { getTransactionsAdmin } from '../../services/admin';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { VehicleEntryExit } from '../../common/interfaces';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import Pagination from '../../components/common/Pagination';
import { formatDateTime } from '../../common/functions';

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminTransactions', searchTerm, page, pageSize],
    queryFn: () => getTransactionsAdmin(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

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
            placeholder="Search transactions..."
            value={searchDisplay}
            onChange={handleSearchDisplayChange}
            bg="white"
            borderColor="secondary.200"
            shadow="md"
            _focus={{ borderColor: 'none', outline: 'none' }}
          />
        </InputGroup>
      </HStack>
      <Box
        h={
          isSuccess && data?.data?.totalPages === 0
            ? 'fit'
            : 'calc(100vh - 350px)'
        }
        overflow="hidden"
      >
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
                <Table.ColumnHeader fontWeight="bold">Code</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Vehicle
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Entrance Name
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Entrance Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Exit Name
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Amount
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Status
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                data?.data?.content?.map((item: VehicleEntryExit) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.code}</Table.Cell>
                    <Table.Cell>{item.vehicleRegistrationNumber}</Table.Cell>
                    <Table.Cell>{item.entranceName ?? 'N/A'}</Table.Cell>
                    <Table.Cell>
                      {formatDateTime(item.entranceTime) ?? 'N/A'}
                    </Table.Cell>
                    <Table.Cell>{item.exitName ?? 'N/A'}</Table.Cell>
                    <Table.Cell>{item.amount ?? 'N/A'}</Table.Cell>
                    <Table.Cell>
                      <Box
                        shadow={'md'}
                        bg={
                          item.status === 'COMPLETED'
                            ? 'blue.400'
                            : item.status === 'PENDING'
                              ? 'blue.400'
                              : 'red.300'
                        }
                        borderRadius={8}
                        px={2}
                        py={0.5}
                        color={'white'}
                        fontSize={'xs'}
                        textAlign={'center'}
                      >
                        {item.status ?? 'N/A'}
                      </Box>
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
    </Box>
  );
};

export default AdminTransactions;
