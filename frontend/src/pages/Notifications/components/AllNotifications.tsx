import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { scrollBarCss } from "../../../common/css";
import { allNotifications } from "../../../common/constants";

const AllNotifications = () => {
  return (
    <Flex
      borderWidth={2}
      borderColor="gray.400"
      borderRadius="lg"
      p={5}
      flexDir="column"
      maxH="full"
      gap={6}
      overflowY="auto"
      css={scrollBarCss}
    >
      {allNotifications.map((notification) => (
        <Box
          key={notification}
          bg="white"
          borderWidth={1}
          borderColor="gray.200"
          p={5}
          borderRadius="lg"
          shadow="md"
        >
          <Text fontSize={{ base: "xs", lg: "sm" }} fontWeight="medium">
            {notification}
          </Text>
        </Box>
      ))}
    </Flex>
  );
};

export default AllNotifications;
