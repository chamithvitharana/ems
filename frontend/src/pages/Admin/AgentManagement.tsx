import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Flex, HStack, Input, Table } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import { scrollBarCss } from '../../common/css';
import { Button } from '../../components/ui/button';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getAgents } from '../../services/admin';
import Pagination from '../../components/common/Pagination';
import { IUpdateAgentPayload } from '../../common/interfaces';
import AgentForm from './components/AgentForm';
import { FaPen } from 'react-icons/fa6';

const AgentManagement = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [selectedAgent, setSelectedAgent] =
    useState<IUpdateAgentPayload | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };

  const toggleUpdateForm = () => {
    setOpenUpdateForm((prev) => !prev);
  };

  const { data, isSuccess } = useQuery({
    queryKey: ['adminAgents', searchTerm, page, pageSize],
    queryFn: () => getAgents(page - 1, pageSize, searchTerm),
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

  const getData = () => {
    queryClient.invalidateQueries({ queryKey: ['adminAgents'] });
  };

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <Flex justify={'flex-end'} mb={5}>
        <Button onClick={() => toggleForm()} colorPalette={'primary'}>
          Create Agent
        </Button>
      </Flex>
      <HStack mb={5}>
        <InputGroup flex="1" startElement={<IoSearchOutline />}>
          <Input
            id="search"
            name="search"
            placeholder="Search agents..."
            value={searchDisplay}
            onChange={handleSearchDisplayChange}
            bg="white"
            borderColor="secondary.200"
            shadow="md"
            _focus={{ borderColor: 'none', outline: 'none' }}
          />
        </InputGroup>
      </HStack>
      <Box h="calc(100vh - 400px)" overflow="hidden">
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
                <Table.ColumnHeader fontWeight="bold">Email</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Contact Number
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Toll Booth
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
              {isSuccess &&
                data?.data?.content?.map((item: IUpdateAgentPayload) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.contactNumber}</Table.Cell>
                    <Table.Cell>{item.accessPointName}</Table.Cell>
                    <Table.Cell
                      fontWeight="bold"
                      color={item.status === 'ACTIVE' ? 'green.600' : 'red.600'}
                    >
                      {item.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex justify={'center'}>
                        <Flex
                          justify={'center'}
                          alignItems={'center'}
                          bg="yellow.100"
                          borderWidth={1}
                          w={'fit'}
                          p={0.5}
                          borderRadius={'md'}
                          cursor={'pointer'}
                          onClick={() => {
                            setIsUpdate(true);
                            setSelectedAgent(item);
                            toggleUpdateForm();
                          }}
                        >
                          <FaPen />
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
      <AgentForm
        open={openForm}
        toggle={() => {
          setSelectedAgent(null);
          setIsUpdate(false);
          toggleForm();
        }}
        getData={getData}
      />
      <AgentForm
        open={openUpdateForm}
        toggle={() => {
          setSelectedAgent(null);
          setIsUpdate(false);
          toggleUpdateForm();
        }}
        getData={getData}
        agent={selectedAgent || undefined}
        isUpdate={isUpdate}
      />
    </Box>
  );
};

export default AgentManagement;
