import  { FC } from "react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button, Flex, Grid, Text } from "@chakra-ui/react";

interface IScannerModalProps {
  scannerModal: boolean;
  QRdata: IScannerData;
  hasJourney: boolean;
  toggleScannerModal: () => void;
}

interface IScannerData {
  owner: string;
  registrationNumber: string;
  mYear: string;
  rYear: string;
  brand: string;
  category: string;
}

const ScannerModal: FC<IScannerModalProps> = ({
  scannerModal,
  QRdata,
  hasJourney,
  toggleScannerModal,
}) => {
  return (
    <DialogRoot
      lazyMount
      open={scannerModal}
      placement="center"
      size={{ base: "xs", md: "md" }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vehicle Details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex flexDir="column" gap={3}>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Owner:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.owner}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Registration Number:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.registrationNumber}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                M. Year:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.mYear}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                R. Year:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.rYear}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Brand:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.brand}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Category:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.category}
              </Text>
            </Flex>
            {hasJourney && (
              <Flex flexDir="column">
                <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                  <Flex gap={1} alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      Start:
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      Pinnaduwa
                    </Text>
                  </Flex>
                  <Flex gap={1} alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      End:
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      Kokmaduwa
                    </Text>
                  </Flex>
                </Grid>
                <Grid gap={5} templateColumns="repeat(2, 1fr)">
                  <Flex gap={1} alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      Distance:
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      6 KM
                    </Text>
                  </Flex>
                  <Flex gap={1} alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      Price:
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      LKR: 100
                    </Text>
                  </Flex>
                </Grid>
              </Flex>
            )}
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => toggleScannerModal()} colorPalette="primary">
            {hasJourney ? "Payment Completed" : "Confirm & Start"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ScannerModal;
