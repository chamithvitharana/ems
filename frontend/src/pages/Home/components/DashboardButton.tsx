import { FC, ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

interface DashboardButtonProps {
  name: string;
  Icon: ReactNode;
  onClick?: () => void;
}

const DashboardButton: FC<DashboardButtonProps> = ({
  name,
  Icon,
  onClick = () => {},
}) => {
  return (
    <Flex
      background="white"
      gap={2}
      alignItems="center"
      shadow="md"
      borderRadius="lg"
      onClick={onClick}
      _hover={{ bg: "primary.50", color: "primary.600" }}
      cursor="pointer"
      justifyContent="center"
      minW={60}
      px={3}
      py={3.5}
    >
      {Icon}
      <Text fontSize="sm" fontWeight="bold">
        {name}
      </Text>
    </Flex>
  );
};

export default DashboardButton;
