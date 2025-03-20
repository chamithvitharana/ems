import React, { useEffect, useState } from 'react';
import {
  Box,
  createListCollection,
  Flex,
  Grid,
  HStack,
  Table,
  Text,
} from '@chakra-ui/react';
import { Button } from '../../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { ICommonType, IPaymentConfig } from '../../common/interfaces';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../components/ui/select';
import { fetchVehicleTypes } from '../../redux/slices/vehicleTypeSlice';
import { toaster } from '../../components/ui/toaster';
import { getFareData, uploadFareSheet } from '../../services/admin';
import { scrollBarCss } from '../../common/css';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Pagination from '../../components/common/Pagination';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { fetchAccessPoints } from '../../redux/slices/accesspointSlice';

const PaymentConfig = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);

  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [destinationFilter, setDestinationFilter] = useState<string>('');

  const { data, isSuccess } = useQuery({
    queryKey: [
      'adminTransactions',
      page,
      pageSize,
      vehicleTypeFilter,
      sourceFilter,
      destinationFilter,
    ],
    queryFn: () =>
      getFareData(
        page - 1,
        pageSize,
        vehicleTypeFilter,
        sourceFilter,
        destinationFilter,
      ),
    placeholderData: keepPreviousData,
  });

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const dispatch = useDispatch<AppDispatch>();
  const { vehicleTypes } = useSelector(
    (state: RootState) => state.vehicleTypes,
  );
  const { accessPoints } = useSelector(
    (state: RootState) => state.accessPoints,
  );

  const [vehicleType, setVehicleType] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || 'No file selected');
  };

  const filterVehicleTypes = vehicleTypes.map((vehi) => vehi.name);
  const filterSources = accessPoints.map((vehi) => vehi.name);
  const filterDestinations = accessPoints.map((vehi) => vehi.name);

  const allVehicleTypes = createListCollection({
    items: vehicleTypes.map((dis: ICommonType) => ({
      label: dis.name,
      value: dis.name,
    })),
  });

  useEffect(() => {
    dispatch(fetchAccessPoints());
    dispatch(fetchVehicleTypes());
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      if (!file) {
        toaster.create({
          description: 'Please select a file',
          type: 'error',
        });
      } else if (!vehicleType[0]) {
        toaster.create({
          description: 'Please select a vehicle type',
          type: 'error',
        });
      } else {
        await uploadFareSheet(file, vehicleType[0]);
        toaster.create({
          description: 'CSV uploaded successfully!',
          type: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
      }
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [vehicleTypeFilter, sourceFilter, destinationFilter]);

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
        <React.Fragment>
          <input
            type="file"
            id="file-upload"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            // @ts-ignore
            htmlFor="file-upload"
            as="label"
            size="md"
            cursor="pointer"
          >
            Select CSV File
          </Button>
        </React.Fragment>
        <SelectRoot
          id="vehicleType"
          name="vehicleType"
          collection={allVehicleTypes}
          bg="white"
          borderColor="secondary.200"
          onValueChange={({ value }) => setVehicleType(value)}
          value={vehicleType}
        >
          <SelectTrigger>
            <SelectValueText placeholder="Select Vehicle Category" />
          </SelectTrigger>
          <SelectContent>
            {allVehicleTypes.items.map((item) => (
              <SelectItem item={item} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        <Text mb={4} textAlign={'center'} fontSize="sm" color="gray.500">
          {fileName || 'No file selected'}
        </Text>
      </Grid>
      <Flex justify={'flex-end'}>
        <Button colorPalette="primary" onClick={handleSubmit}>
          Upload CSV
        </Button>
      </Flex>
      <HStack mt={3} mb={5} gap={2}>
        <SearchableDropdown
          options={filterVehicleTypes}
          selectedOption={vehicleTypeFilter}
          setSelectedOption={setVehicleTypeFilter}
          label="Select Vehicle Type"
        />
        <SearchableDropdown
          options={filterSources}
          selectedOption={sourceFilter}
          setSelectedOption={setSourceFilter}
          label="Select Source"
        />
        <SearchableDropdown
          options={filterDestinations}
          selectedOption={destinationFilter}
          setSelectedOption={setDestinationFilter}
          label="Select Destination"
        />
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
                <Table.ColumnHeader fontWeight="bold">
                  Source
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Destination
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Fare</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Category
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                data?.data?.content?.map((item: IPaymentConfig) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.source}</Table.Cell>
                    <Table.Cell>{item.destination || 'N/A'}</Table.Cell>
                    <Table.Cell>{item.fare || 'N/A'}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
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
            page={page}
          />
        </Flex>
      )}
    </Box>
  );
};

export default PaymentConfig;
