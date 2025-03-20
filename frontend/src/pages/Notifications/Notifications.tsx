import React from 'react';
import {
  Box,
  Center,
  Flex,
  Separator,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getAgentNotifications,
  getCustomerNotifications,
} from '../../services/agent';
import { INotificationData } from '../../common/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TbSpeakerphone } from 'react-icons/tb';
import { useAuth } from '../../hooks/useAuth';

const Notifications = () => {
  const { getRole } = useAuth();
  const userRole = getRole();
  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['customerNotifications'],
      queryFn: ({ pageParam }) => {
        if (userRole === 'CUSTOMER') {
          return getCustomerNotifications(pageParam - 1, 6);
        } else {
          return getAgentNotifications(pageParam - 1, 6);
        }
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages, lastPageParam) =>
        lastPage.data.totalElements > 0 ? lastPageParam + 1 : undefined,
    });

  const allNotifications: INotificationData[] = isSuccess
    ? data.pages.flatMap((page) => page.data.content)
    : [];

  const padding = useBreakpointValue({ base: 4, md: 8, lg: 16 });

  return (
    <Flex flexDir="column" p={padding} justifyContent="flex-start">
      <Text
        textAlign={{ base: 'center', md: 'left' }}
        fontSize="3xl"
        fontWeight="bold"
        mb={6}
        color="gray.700"
      >
        Notifications
      </Text>
      <Box
        id="notificationParent"
        overflowY="auto"
        h="calc(100vh - 350px)"
        borderRadius="md"
        boxShadow="md"
        p={5}
      >
        <InfiniteScroll
          dataLength={allNotifications.length}
          next={() => !isFetchingNextPage && fetchNextPage()}
          hasMore={hasNextPage}
          loader={
            isFetchingNextPage && (
              <Center mt={5}>
                <Text color="gray.600">Loading more notifications...</Text>
              </Center>
            )
          }
          endMessage={
            <Center mt={5}>
              <Separator w={20} size="md" />
              <Text mt={2} color="gray.500">
                You've reached the end of your notifications.
              </Text>
            </Center>
          }
          scrollThreshold={0.5}
          scrollableTarget="notificationParent"
        >
          {allNotifications.map((notification) => (
            <Box
              key={notification.id}
              bg="white"
              borderWidth={1}
              borderColor="gray.200"
              p={5}
              borderRadius="lg"
              mb={4}
              shadow="md"
              display="flex"
              alignItems="center"
              gap={4}
              _hover={{ bg: 'gray.50', cursor: 'pointer' }}
              transition="background 0.2s ease-in-out"
            >
              <Flex gap={2} alignItems={'center'}>
                <TbSpeakerphone />
                <Text fontSize="xs" fontWeight="medium" color="gray.500">
                  {notification.content}
                </Text>
              </Flex>
            </Box>
          ))}
        </InfiniteScroll>
      </Box>
    </Flex>
  );
};

export default Notifications;
