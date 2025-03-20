import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Flex, HStack, Input, Table, Text } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import ViewModal from './components/ViewModal';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import { debounce } from 'lodash';
import { Button } from '../../components/ui/button';
import AccessModalForm from './components/AccessModalForm';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getAdminAccessPoints } from '../../services/admin';
import { IUpdateAccessPointInputs } from '../../common/interfaces';
import Pagination from '../../components/common/Pagination';
import { FaEye, FaPen } from 'react-icons/fa6';

const AccessPoints = () => {
  const queryClient = useQueryClient();

  const [openViewDialog, setOpenViewModal] = useState<boolean>(false);
  const [selectedAccessPoint, setSelectedAccessPoint] =
    useState<IUpdateAccessPointInputs | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminAccessPoint', searchTerm, page, pageSize],
    queryFn: () => getAdminAccessPoints(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

  const toggleViewDialog = () => {
    setOpenViewModal((prev) => !prev);
  };

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };

  const toggleUpdateForm = () => {
    setOpenUpdateForm((prev) => !prev);
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

  const getData = () => {
    queryClient.invalidateQueries({ queryKey: ['adminAccessPoint'] });
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <Flex justify={'flex-end'} mb={5}>
        <Button onClick={() => toggleForm()} colorPalette={'primary'}>
          Create Access Point
        </Button>
      </Flex>
      <HStack mb={5}>
        <InputGroup flex="1" startElement={<IoSearchOutline />}>
          <Input
            id="search"
            name="search"
            placeholder="Search access points..."
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
                <Table.ColumnHeader fontWeight="bold">Name</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Code</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Longitude
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Latitude
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Emergency Alert Email
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Emergency Alert Mobile
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center" fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                data?.data?.content?.map((item: IUpdateAccessPointInputs) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.code}</Table.Cell>
                    <Table.Cell>{item.lon}</Table.Cell>
                    <Table.Cell>{item.lat}</Table.Cell>
                    <Table.Cell>{item.emergencyAlertEmail}</Table.Cell>
                    <Table.Cell>{item.emergencyAlertMobile}</Table.Cell>
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
                            setSelectedAccessPoint(item);
                            toggleViewDialog();
                          }}
                        >
                          <FaEye />
                        </Flex>
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
                            setSelectedAccessPoint(item);
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
      <AccessModalForm
        open={openForm}
        toggle={() => {
          setSelectedAccessPoint(null);
          setIsUpdate(false);
          toggleForm();
        }}
        getData={getData}
      />
      <AccessModalForm
        open={openUpdateForm}
        toggle={() => {
          setSelectedAccessPoint(null);
          setIsUpdate(false);
          toggleUpdateForm();
        }}
        getData={getData}
        accessPoint={selectedAccessPoint || undefined}
        isUpdate={isUpdate}
      />
      <ViewModal
        open={openViewDialog}
        confirm={() => toggleViewDialog()}
        title="Edit Access Point"
        body={
          <Flex flexDir="column" gap={3}>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Name:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedAccessPoint?.name}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Code:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedAccessPoint?.code}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Longitude:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedAccessPoint?.lon}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Latitude:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedAccessPoint?.lat}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Emergency Alert Email:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {selectedAccessPoint?.emergencyAlertEmail}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Emergency Alert Mobile:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="bold">
                {selectedAccessPoint?.emergencyAlertMobile}
              </Text>
            </Flex>
          </Flex>
        }
      />
    </Box>
  );
};

export default AccessPoints;
