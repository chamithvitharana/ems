import { Center, Spinner } from "@chakra-ui/react";
import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

interface PrivateRouteProps {
  element: ReactNode;
}

const AdminRoute: FC<PrivateRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const checkAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole");

    setIsAuthenticated(!!accessToken);
    setRole(userRole);
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isAuthenticated && role !== "ADMIN") {
    toaster.create({
      description: "Unauthorized",
      type: "error",
    });
    return <Navigate to="/home" replace />;
  }

  return isAuthenticated ? (
    <Fragment>{element}</Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
