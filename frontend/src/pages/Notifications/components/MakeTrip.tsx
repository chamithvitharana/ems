import React, { FC, MutableRefObject } from "react";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { scrollBarCss } from "../../../common/css";
import { BsQrCode } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import Webcam from "react-webcam";
import { Button } from "../../../components/ui/button";
import { IoCameraSharp } from "react-icons/io5";

interface IMakeTripProps {
  showQrReader: boolean;
  showNumberPlateScanner: boolean;
  toggleQrReader: () => void;
  toggleNumberPlateScanner: () => void;
  handleScanner: (result: IDetectedBarcode[]) => void;
  webcamRef: MutableRefObject<any>;
  capture: () => void;
}

const MakeTrip: FC<IMakeTripProps> = ({
  showQrReader,
  showNumberPlateScanner,
  toggleNumberPlateScanner,
  toggleQrReader,
  webcamRef,
  handleScanner,
  capture,
}) => {
  return (
    <Flex
      borderWidth={2}
      borderColor="gray.400"
      borderRadius="lg"
      p={8}
      flexDir="column"
      maxH="full"
      gap={6}
      overflowY="auto"
      css={scrollBarCss}
    >
      <Center>
        {!showQrReader && !showNumberPlateScanner && (
          <Flex mdDown={{ flexDir: "column" }} gap={8}>
            <Flex
              alignItems="center"
              justify="center"
              flexDir="column"
              gap={3}
              borderRadius="50%"
              borderWidth={2}
              borderColor="primary.100"
              bg="gray.100"
              shadow="md"
              cursor="pointer"
              w={160}
              h={150}
              onClick={() => toggleQrReader()}
              _hover={{ shadow: "lg" }}
            >
              <BsQrCode size={44} />
              <Text fontWeight="bold">Scan QR Code</Text>
            </Flex>
            <Flex
              alignItems="center"
              justify="center"
              flexDir="column"
              gap={3}
              borderRadius="50%"
              borderWidth={2}
              borderColor="primary.100"
              bg="gray.100"
              shadow="md"
              cursor="pointer"
              w={160}
              h={150}
              onClick={() => toggleNumberPlateScanner()}
              _hover={{ shadow: "lg" }}
            >
              <BsQrCode size={44} />
              <Text fontWeight="bold">Scan Number Plate</Text>
            </Flex>
          </Flex>
        )}
        {showQrReader && (
          <Box position="relative" w={{ md: 400 }} h={{ md: 400 }}>
            <Box position="absolute" zIndex={1} right={0}>
              <IoIosCloseCircleOutline
                size={30}
                color="white"
                cursor="pointer"
                onClick={() => toggleQrReader()}
              />
            </Box>
            <Scanner
              onScan={handleScanner}
              onError={(error: unknown) => console.log(error)}
            />
          </Box>
        )}
        {showNumberPlateScanner && (
          <Box position="relative" w={{ md: 400 }} h={{ md: 400 }}>
            <Box position="absolute" zIndex={1} right={0}>
              <IoIosCloseCircleOutline
                size={30}
                color="white"
                cursor="pointer"
                onClick={() => toggleNumberPlateScanner()}
              />
            </Box>
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              ref={webcamRef}
              videoConstraints={{ facingMode: "environment" }}
            />
            <Flex justify="center">
              <Button position="absolute" bottom={5} w={32} onClick={capture}>
                <IoCameraSharp />
              </Button>
            </Flex>
          </Box>
        )}
        {/* {imgSrc && <Image src={imgSrc} />} */}
      </Center>
    </Flex>
  );
};

export default MakeTrip;
