import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Input,
  Table,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Field } from '../../components/ui/field';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { toaster } from '../../components/ui/toaster';
import { scrollBarCss } from '../../common/css';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import { debounce } from 'lodash';
import {
  INotification,
  INotificationData,
  INotificationPayload,
} from '../../common/interfaces';
import { getAdminNotifications, sendNotification } from '../../services/admin';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Pagination from '../../components/common/Pagination';

const AdminNotifications = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<INotification>();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(6);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminNotifications', searchTerm, page, pageSize],
    queryFn: () => getAdminNotifications(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

  const onSubmit: SubmitHandler<INotification> = async (data) => {
    try {
      if (!data.isAgentNotification && !data.isCustomerNotification) {
        toaster.create({
          description: 'At least one end-user required!',
          type: 'error',
        });
      } else if (!data.isSmsNotification && !data.isEmailNotification) {
        toaster.create({
          description: 'At least one notification type required!',
          type: 'error',
        });
      } else {
        const payload: INotificationPayload = {
          ...data,
          notificationSource: 'ADMIN_NOTIFICATION',
        };
        const res = await sendNotification(payload);
        if (res.statusCode === 200) {
          toaster.create({
            description: 'Notification sent successfully!',
            type: 'success',
          });
          reset({
            content: '',
            isAgentNotification: false,
            isCustomerNotification: false,
            isEmailNotification: false,
            isSmsNotification: false,
          });
          queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        }
      }
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field label="Message">
          <Textarea
            placeholder="Start typing..."
            {...register('content', { required: 'Message is required' })}
            bg="white"
            resize="none"
            h={20}
          />
          <Text fontSize="xs" color="red.600">
            {errors.content && errors.content.message}
          </Text>
        </Field>
        <Flex my={3} gap={4} flexWrap="wrap" alignItems="center">
          <Controller
            name="isCustomerNotification"
            control={control}
            render={({ field }) => (
              <Switch
                colorPalette="green"
                name={field.name}
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                <Text fontWeight="bold">Customer</Text>
              </Switch>
            )}
          />
          <Controller
            name="isAgentNotification"
            control={control}
            render={({ field }) => (
              <Switch
                colorPalette="green"
                name={field.name}
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                <Text fontWeight="bold">Agent</Text>
              </Switch>
            )}
          />
          <Controller
            name="isSmsNotification"
            control={control}
            render={({ field }) => (
              <Switch
                colorPalette="green"
                name={field.name}
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                <Text fontWeight="bold">SMS</Text>
              </Switch>
            )}
          />
          <Controller
            name="isEmailNotification"
            control={control}
            render={({ field }) => (
              <Switch
                colorPalette="green"
                name={field.name}
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                <Text fontWeight="bold">Email</Text>
              </Switch>
            )}
          />
          <Button loading={isSubmitting} colorPalette="primary" type="submit">
            Publish
          </Button>
        </Flex>
      </form>
      <HStack mb={5}>
        <InputGroup flex="1" startElement={<IoSearchOutline />}>
          <Input
            id="search"
            name="search"
            placeholder="Search notifications..."
            value={searchDisplay}
            onChange={handleSearchDisplayChange}
            bg="white"
            borderColor="secondary.200"
            shadow="md"
            _focus={{ borderColor: 'none', outline: 'none' }}
          />
        </InputGroup>
      </HStack>
      <Box h="calc(100vh - 450px)" overflow="hidden">
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
                  Content
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Notification Type
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Notification Source
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Customer Notification
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Agent Notification
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isSuccess &&
                data?.data?.content?.map((item: INotificationData) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.content}</Table.Cell>
                    <Table.Cell>{item.notificationType || 'N/A'}</Table.Cell>
                    <Table.Cell>{item.notificationSource}</Table.Cell>
                    <Table.Cell>
                      {item.customerNotification ? 'Yes' : 'No'}
                    </Table.Cell>
                    <Table.Cell>
                      {item.agentNotification ? 'Yes' : 'No'}
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

export default AdminNotifications;
