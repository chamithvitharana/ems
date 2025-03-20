import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Flex, HStack, Input, Table, Text } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import { debounce } from 'lodash';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import { getCustomerTransactions } from '../../services/vehicles';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../../components/common/Pagination';
import { formatDateTime } from '../../common/functions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { fetchAccessPoints } from '../../redux/slices/accesspointSlice';
import { AppDispatch } from '../../redux/store';

const Transactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getUser } = useAuth();

  const currentUser = getUser();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const { accessPoints } = useSelector(
    (state: RootState) => state.accessPoints,
  );

  useEffect(() => {
    dispatch(fetchAccessPoints());
  }, [dispatch]);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminTransactions', searchTerm, page, pageSize],
    queryFn: () =>
      getCustomerTransactions(
        page - 1,
        pageSize,
        searchTerm,
        currentUser.email,
      ),
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
    <Box lgDown={{ p: 5 }} lg={{ px: 28, py: 12 }} xl={{ px: 32, py: 12 }}>
      <Text
        textAlign={{ base: 'center', md: 'left' }}
        fontSize="3xl"
        fontWeight="bold"
        mb={5}
      >
        My Transactions
      </Text>
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
                <Table.ColumnHeader fontWeight="bold">
                  Registration Number
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Entrance
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Exit</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Entrance Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Exit Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end" fontWeight="bold">
                  Amount
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                data?.data?.content?.map((item: any) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.vehicleRegistrationNumber}</Table.Cell>
                    <Table.Cell>
                      {
                        accessPoints.find((ele) => ele.id === item.entranceId)
                          ?.name
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {accessPoints.find((ele) => ele.id === item.exitId)?.name}
                    </Table.Cell>
                    <Table.Cell>{formatDateTime(item.entranceTime)}</Table.Cell>
                    <Table.Cell>{formatDateTime(item.exitTime)}</Table.Cell>
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
                    <Table.Cell textAlign="end">Rs.{item.amount}</Table.Cell>
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

export default Transactions;
