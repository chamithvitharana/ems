import { useCallback, useRef, useState } from 'react';
import { Flex, Tabs, Text } from '@chakra-ui/react';
import { FaCarOn } from 'react-icons/fa6';
import { IDetectedBarcode } from '@yudiel/react-qr-scanner';
import ScannerModal from './components/ScannerModal';
import MakeTrip from './components/MakeTrip';
import { useAuth } from '../../hooks/useAuth';
import {
  getTransactionDetails,
  manualPayment,
  startTransaction,
} from '../../services/agent';
import { toaster } from '../../components/ui/toaster';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useMutation } from '@tanstack/react-query';

interface IScannerData {
  customerName: string;
  vehicleNumber: string;
  registeredYear: string;
  manufacturedYear: string;
  fuelType: string;
  vehicleType: string;
  brand: string;
}

interface ICurrentJourney {
  entranceName: string;
  entranceTime: string;
}

const Journeys = () => {
  const { getUser } = useAuth();

  const currentUser = getUser();

  const [QRdata, setQRData] = useState<IScannerData>({} as IScannerData);
  const [currentJourneyQRdata, setCurrentJourneyQRData] =
    useState<ICurrentJourney>({} as ICurrentJourney);

  const [showQrReader, setShowQrReader] = useState<boolean>(false);

  const [scannerModal, setScannerModal] = useState<boolean>(false);
  const [hasJourney, setHasJourney] = useState<boolean>(false);

  const [openToggleConfirm, setOpenToggleConfirm] = useState<boolean>(false);
  const [transactionID, setTransactionID] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const [showNumberPlateScanner, setShowNumberPlateScanner] =
    useState<boolean>(false);

  const webcamRef = useRef<any>(null);
  // const [imgSrc, setImgSrc] = useState(null);

  const toggleNumberPlateScanner = () => {
    setShowNumberPlateScanner((prev) => !prev);
  };

  const toggleScannerModal = () => {
    setScannerModal((prev) => !prev);
  };

  const toggleQrReader = () => {
    setShowQrReader((prev) => !prev);
  };

  const handleScanner = async (result: IDetectedBarcode[]) => {
    if (result.length > 0) {
      try {
        const res = await getTransactionDetails(result[0].rawValue);
        if (res.statusCode === 200) {
          const vehicle = res.data.vehicle;
          const customer = res.data.customer;
          setHasJourney(res.data.entrance !== null);
          if (res.data.entrance !== null) {
            setCurrentJourneyQRData({
              entranceName: res.data.entrance.name,
              entranceTime: res.data.transaction.entranceTime,
            });
          }
          setQRData({
            brand: vehicle.brand.name,
            customerName: customer.name,
            fuelType: vehicle.fuelType.name,
            manufacturedYear: vehicle.manufacturedYear,
            registeredYear: vehicle.registeredYear,
            vehicleNumber: vehicle.registrationNumber,
            vehicleType: vehicle.vehicleType.name,
          });
        }
        setShowQrReader(false);
        toggleScannerModal();
      } catch (error) {
        toaster.create({
          description: 'Vehicle not found! Please contact administrator',
          type: 'error',
        });
        setShowQrReader(false);
      }
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      // const imageSrc = webcamRef.current.getScreenshot();
      // setImgSrc(imageSrc);
    }
    toggleNumberPlateScanner();
  }, [webcamRef]);

  const startEndJourney = async () => {
    try {
      const res = await startTransaction(
        QRdata.vehicleNumber,
        currentUser.accessPointId,
      );
      if (res.statusCode === 200) {
        toaster.create({
          description: 'Journey Started!',
          type: 'success',
        });
        if (hasJourney) {
          const status = res.data.status;
          if (status !== 'COMPLETED') {
            setTransactionID(res.data.id);
            setAmount(res.data.amount);
            togglePaymentDialog();
          }
        }
        toggleScannerModal();
      }
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const togglePaymentDialog = () => {
    setOpenToggleConfirm((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => manualPayment(data.id),
    onSuccess: () => {
      toaster.create({
        description: 'Payment updated successfully!',
        type: 'success',
      });
      togglePaymentDialog();
      setTransactionID(null);
      setAmount(null);
    },
    onError: (error) => {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    },
  });

  const onToggleStatus = () => {
    if (transactionID) {
      mutation.mutate({
        id: transactionID,
      });
    }
  };

  return (
    <Flex
      flexDir="column"
      lgDown={{ p: 5 }}
      lg={{ px: 28, py: 12 }}
      xl={{ px: 32, py: 12 }}
    >
      <Text
        textAlign={{ base: 'center', md: 'left' }}
        fontSize="3xl"
        fontWeight="bold"
        mb={5}
      >
        Make a trip
      </Text>
      <Tabs.Root
        variant="outline"
        defaultValue="maketrip"
        lazyMount
        unmountOnExit
        colorPalette="teal"
      >
        <Tabs.List>
          <Tabs.Trigger
            _selected={{
              fontWeight: 'bold',
              borderTopColor: 'gray.500',
              borderLeftColor: 'gray.500',
              borderRightColor: 'gray.500',
            }}
            value="maketrip"
          >
            <FaCarOn />
            Make a trip
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="maketrip">
          <MakeTrip
            showQrReader={showQrReader}
            toggleNumberPlateScanner={toggleNumberPlateScanner}
            toggleQrReader={toggleQrReader}
            webcamRef={webcamRef}
            handleScanner={handleScanner}
            showNumberPlateScanner={showNumberPlateScanner}
            capture={capture}
          />
        </Tabs.Content>
      </Tabs.Root>
      <ScannerModal
        QRdata={QRdata}
        hasJourney={hasJourney}
        scannerModal={scannerModal}
        toggleScannerModal={toggleScannerModal}
        confirm={startEndJourney}
        currentJourney={currentJourneyQRdata}
      />
      <ConfirmDialog
        open={openToggleConfirm}
        title="Collect Cash"
        message={`Please collect the fee of Rs.${amount} from the customer!`}
        cancel={togglePaymentDialog}
        confirm={() => onToggleStatus()}
        submitBtn
        loading={mutation.isPending}
        customSubmit="Collected"
      />
    </Flex>
  );
};

export default Journeys;
