import { FC } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button, Flex, Grid, Text } from '@chakra-ui/react';
import { formatDateTime } from '../../../common/functions';

interface IScannerModalProps {
  scannerModal: boolean;
  QRdata: IScannerData;
  hasJourney: boolean;
  toggleScannerModal: () => void;
  confirm: () => void;
  currentJourney: ICurrentJourney;
}

interface ICurrentJourney {
  entranceName: string;
  entranceTime: string;
}

interface IScannerData {
  customerName: string;
  vehicleNumber: string;
  registeredYear: string;
  manufacturedYear: string;
  fuelType: string;
  vehicleType: string;
  brand: string;
}

const ScannerModal: FC<IScannerModalProps> = ({
  scannerModal,
  QRdata,
  hasJourney,
  toggleScannerModal,
  confirm,
  currentJourney,
}) => {
  return (
    <DialogRoot
      lazyMount
      open={scannerModal}
      placement="center"
      size={{ base: 'xs', md: 'md' }}
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
                {QRdata.customerName}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Registration Number:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.vehicleNumber}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Registered Year:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.registeredYear}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Manufactured Year:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.manufacturedYear}
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
                Vehicle Type:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.vehicleType}
              </Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Fuel Type:
              </Text>
              <Text color="gray.500" fontSize="sm" fontWeight="medium">
                {QRdata.fuelType}
              </Text>
            </Flex>
            {hasJourney && (
              <Flex flexDir="column">
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  <Flex gap={1} alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      Entrance Name:
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      {currentJourney.entranceName}
                    </Text>
                  </Flex>
                  <Flex gap={1} alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      Entered Time:
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">
                      {formatDateTime(currentJourney.entranceTime)}
                    </Text>
                  </Flex>
                </Grid>
              </Flex>
            )}
          </Flex>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => toggleScannerModal()}
            variant={'outline'}
            colorPalette="secondary"
          >
            Close
          </Button>
          <Button onClick={() => confirm()} colorPalette="primary">
            {hasJourney ? 'Complete Journey' : 'Confirm & Start'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ScannerModal;
