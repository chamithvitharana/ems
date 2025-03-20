import React, { useState } from 'react';
import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { toaster } from '../../components/ui/toaster';
import { downloadPDF, downloadTransactionPDF } from '../../services/admin';
import { Button } from '../../components/ui/button';
import { downloadFile } from '../../common/functions';

const ReportingModule = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehiNumber, setVehiNumber] = useState('');

  const downloadAllPdf = async (type: string) => {
    try {
      const res = await downloadPDF(type);

      downloadFile(res, `${type}-report.pdf`);

      toaster.create({
        description: 'Report downloaded successfully!',
        type: 'success',
      });
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const downloadTransactionReport = async () => {
    try {
      if (!startDate) {
        toaster.create({
          description: 'Please select a start date!',
          type: 'error',
        });
        return;
      } else if (!endDate) {
        toaster.create({
          description: 'Please select a end date!',
          type: 'error',
        });
        return;
      }
      const res = await downloadTransactionPDF(startDate, endDate, vehiNumber);

      downloadFile(res, 'transaction-report.pdf');

      toaster.create({
        description: 'Report downloaded successfully!',
        type: 'success',
      });
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };
  return (
    <Grid
      h={'calc(100vh - 64px)'}
      flexGrow={1}
      px={20}
      py={12}
      gap={8}
      templateColumns={'repeat(2,1fr)'}
    >
      <Box
        _hover={{ bg: 'gray.200' }}
        cursor={'pointer'}
        bg={'white'}
        shadow={'md'}
        p={5}
        borderRadius={12}
        onClick={() => downloadAllPdf('customer')}
        minH={52}
      >
        <Text textStyle={'lg'} fontWeight={'bold'} textAlign={'center'}>
          Customers
        </Text>
        <Flex
          flexDir={'column'}
          h={'full'}
          justify={'center'}
          alignItems={'center'}
        >
          <Text
            mt={-8}
            textStyle={'2xl'}
            textAlign={'center'}
            verticalAlign={'middle'}
            fontWeight={'bold'}
          >
            Download Detailed PDF
          </Text>
        </Flex>
      </Box>
      <Box
        _hover={{ bg: 'gray.200' }}
        cursor={'pointer'}
        bg={'white'}
        shadow={'md'}
        p={5}
        borderRadius={12}
        onClick={() => downloadAllPdf('agent')}
        minH={52}
      >
        <Text textStyle={'lg'} fontWeight={'bold'} textAlign={'center'}>
          Agents
        </Text>
        <Flex
          flexDir={'column'}
          h={'full'}
          justify={'center'}
          alignItems={'center'}
        >
          <Text
            mt={-8}
            textStyle={'2xl'}
            textAlign={'center'}
            verticalAlign={'middle'}
            fontWeight={'bold'}
          >
            Download Detailed PDF
          </Text>
        </Flex>
      </Box>
      <Box
        _hover={{ bg: 'gray.200' }}
        cursor={'pointer'}
        bg={'white'}
        shadow={'md'}
        p={5}
        borderRadius={12}
        onClick={() => downloadAllPdf('vehicle')}
        minH={52}
      >
        <Text textStyle={'lg'} fontWeight={'bold'} textAlign={'center'}>
          Vehicles
        </Text>
        <Flex
          flexDir={'column'}
          h={'full'}
          justify={'center'}
          alignItems={'center'}
        >
          <Text
            mt={-8}
            textStyle={'2xl'}
            textAlign={'center'}
            verticalAlign={'middle'}
            fontWeight={'bold'}
          >
            Download Detailed PDF
          </Text>
        </Flex>
      </Box>
      <Box
        _hover={{ bg: 'gray.200' }}
        cursor={'pointer'}
        bg={'white'}
        shadow={'md'}
        p={5}
        borderRadius={12}
        minH={52}
      >
        <Text textStyle={'lg'} fontWeight={'bold'} textAlign={'center'}>
          Transactions
        </Text>
        <Flex
          flexDir={'column'}
          h={'full'}
          justify={'center'}
          alignItems={'center'}
        >
          <Grid mt={-8} templateColumns={'repeat(2,1fr)'} gap={4}>
            <Input
              bg={'white'}
              id="start"
              type="date"
              placeholder="2005/06/15"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              bg={'white'}
              id="end"
              type="date"
              placeholder="2002/06/15"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Input
              bg={'white'}
              id="vehicleNum"
              placeholder="HDS-208"
              value={vehiNumber}
              onChange={(e) => setVehiNumber(e.target.value)}
            />
            <Button onClick={() => downloadTransactionReport()}>
              Download Detailed Report
            </Button>
          </Grid>
        </Flex>
      </Box>
    </Grid>
  );
};

export default ReportingModule;
