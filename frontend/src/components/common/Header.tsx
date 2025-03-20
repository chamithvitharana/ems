import { FC } from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Avatar } from "../../components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../../components/ui/menu";
import { MdArrowDropDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoSidebarCollapse } from "react-icons/go";
import { useAuth } from "../../hooks/useAuth";

interface IHeaderProps {
  onToggleSidebar?: () => void;
}

const Header: FC<IHeaderProps> = ({ onToggleSidebar }) => {
  const { getUser } = useAuth();
  const navigate = useNavigate();

  const currentUser = getUser();

  const logOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const onSelect = (details: any) => {
    if (details.value === "Logout") {
      logOut();
    }
  };

  return (
    <Flex
      zIndex={201}
      px={4}
      py={2.5}
      background="white"
      alignItems="center"
      justifyContent="space-between"
      shadow="md"
    >
      <Image
        onClick={() => navigate("/home")}
        objectFit="contain"
        w={50}
        src="/assets/ems-logo.png"
        cursor="pointer"
      />
      <Flex alignItems="center" gap={3} hideFrom="md">
        {onToggleSidebar && (
          <GoSidebarCollapse onClick={() => onToggleSidebar()} />
        )}
        <MenuRoot>
          <MenuTrigger asChild>
            <GiHamburgerMenu />
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="_">
              <Avatar
                name={currentUser?.name || "Admin"}
                shape="full"
                size="xs"
              />
              <Text fontSize="xs" fontWeight="bold">
                {currentUser?.name || "Admin"}
              </Text>
            </MenuItem>
            <MenuItem
              value="Logout"
              cursor="pointer"
              _hover={{ bg: "primary.50", color: "primary.600" }}
            >
              <Text fontWeight="medium">Log out</Text>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
      <Flex hideBelow="md" gap={2} alignItems="center">
        <Avatar name={currentUser?.name || "Admin"} shape="full" size="lg" />
        <Text fontWeight="bold">{currentUser?.name || "Admin"}</Text>
        <MenuRoot onSelect={onSelect}>
          <MenuTrigger asChild>
            <MdArrowDropDown cursor="pointer" size={32} />
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              cursor="pointer"
              value="Logout"
              _hover={{ bg: "primary.50", color: "primary.600" }}
            >
              <Text fontWeight="medium">Log out</Text>
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </Flex>
  );
};

export default Header;
