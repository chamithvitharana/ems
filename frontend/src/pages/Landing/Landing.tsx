import React from 'react';
import {
  Box,
  createListCollection,
  Flex,
  Grid,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { Field } from '../../components/ui/field';
import { Button } from '../../components/ui/button';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../components/ui/select';
import { getFare, getPublicAccessPoints } from '../../services/public';
import { useQuery } from '@tanstack/react-query';
import { ICommonType } from '../../common/interfaces';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../components/ui/toaster';

const Landing = () => {
  const navigate = useNavigate();
  const [from, setFrom] = React.useState<string[]>([]);
  const [to, setTo] = React.useState<string[]>([]);
  const [fare, setFare] = React.useState<number>(0);

  const { data, isSuccess } = useQuery({
    queryKey: ['publicAccessPoints'],
    queryFn: () => getPublicAccessPoints(),
  });

  const calculateFare = async () => {
    try {
      if (!from) {
        toaster.create({
          description: 'Source required!',
          type: 'error',
        });
        return;
      }
      if (!to) {
        toaster.create({
          description: 'Destination required!',
          type: 'error',
        });
        return;
      }
      const res = await getFare(from[0], to[0]);

      if (res) {
        setFare(res.content[0].fare);
        toaster.create({
          description: 'Fare calculated',
          type: 'success',
        });
      }
    } catch (error: any) {
      toaster.create({
        description: error.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const allAccessPoints = createListCollection({
    items:
      data?.map((dis: ICommonType) => ({
        label: dis.name,
        value: dis.name.toString(),
      })) || [],
  });

  return (
    <Box fontFamily="inter" position="relative" height="100vh" width="100%">
      <Image
        src="/assets/landing-cover.png"
        alt="Top Image"
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="60vh"
        objectFit="cover"
        zIndex={1}
      />
      <Image
        src="/assets/clouds.png"
        alt="Bottom Image"
        position="absolute"
        top="28vh"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
        h="fit"
        zIndex={2}
      />
      <Flex
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={5}
        py={'24px'}
        flexDir={'column'}
      >
        <Flex justify={'space-around'} alignItems={'center'}>
          <Text
            minW="225px"
            color={'white'}
            textStyle={'xl'}
            fontWeight={'bold'}
          >
            LOGO
          </Text>
          <Flex minW="225px" gap={8}>
            <Text color={'white'} textStyle={'lg'}>
              Home
            </Text>
            <Text color={'white'} textStyle={'lg'}>
              About
            </Text>
            <Text color={'white'} textStyle={'lg'}>
              Contact
            </Text>
          </Flex>
          <Flex minW="225px" gap={4}>
            <Button
              onClick={() => navigate('/signup')}
              color={'white'}
              variant={'outline'}
              _hover={{ color: 'black' }}
            >
              Sign up
            </Button>
            <Button
              onClick={() => navigate('/login')}
              color={'white'}
              colorPalette={'primary'}
            >
              Login
            </Button>
          </Flex>
        </Flex>
        <Flex
          mt={4}
          justify={'center'}
          alignItems={'center'}
          flexDir={'column'}
        >
          <Text color={'white'} fontSize="16px">
            Expressway Management System
          </Text>
          <Text color={'white'} fontSize="36px" fontWeight={'bold'}>
            Streamlining Journeys
          </Text>
          <Text
            w={'600px'}
            textAlign={'center'}
            color="primary.400"
            fontSize="72px"
            fontWeight={'bold'}
            lineHeight={1}
            textShadow="-2px 2px 4px rgba(0, 0, 0, 0.5),
                2px -2px 0 rgba(255, 255, 255, 0.9)"
          >
            Empowering Roads
          </Text>
        </Flex>
        <Flex mt="3%" gap={4} justify={'center'}>
          <Box
            bg={'white'}
            py={'18px'}
            px={'26px'}
            shadow={'0px 4px 4px 0px #00000012'}
            borderRadius={12}
            minW="500px"
          >
            <Text color="#64748B" textStyle={'sm'}>
              Select your entrance and exist to calculate your fare.
            </Text>
            <Flex alignItems={'center'} mt={3} gap={4}>
              {isSuccess && (
                <React.Fragment>
                  <SelectRoot
                    id="from"
                    name="from"
                    collection={allAccessPoints}
                    bg="white"
                    borderColor="secondary.200"
                    onValueChange={({ value }) => setFrom(value)}
                    value={from}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccessPoints?.items?.map((item: any) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <SelectRoot
                    id="to"
                    name="to"
                    collection={allAccessPoints}
                    bg="white"
                    borderColor="secondary.200"
                    onValueChange={({ value }) => setTo(value)}
                    value={to}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccessPoints?.items?.map((item: any) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </React.Fragment>
              )}
              <Button onClick={() => calculateFare()} colorPalette={'primary'}>
                Calculate Fee
              </Button>
            </Flex>
          </Box>
          <Box
            bg={'white'}
            py={'18px'}
            px={'26px'}
            boxShadow={'0px 4px 4px 0px #00000012'}
            borderRadius={12}
          >
            <Text textStyle="3xl" fontWeight={'bolder'}>
              {fare}LKR
            </Text>
            <Text mt={3} color="#475569">
              From Kottawa to Kahanthuduwa
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex
        position="absolute"
        flexDir={'column'}
        bottom={0}
        left={0}
        w="100%"
        h="40.5vh"
        zIndex={4}
        bg="#F1F5F9"
        px={'150px'}
        py={'64px'}
      >
        <Grid w={'full'} templateColumns={{ lg: 'repeat(3, 1fr)' }} gap={8}>
          <Box w={'full'}>
            <Text textStyle={'2xl'} fontWeight={'bold'}>
              LOGO
            </Text>
            <Flex justify={'flex-start'} flexDir={'column'} mt={3} gap={2}>
              <Text color="#6A6A6A" textStyle="sm">
                Address: 60-49 Road 11378 New York
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Phone: +65 11.188.888
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Phone: +65 11.188.888
              </Text>
            </Flex>
          </Box>
          <Box w={'full'}>
            <Text textStyle={'2xl'} fontWeight={'bold'}>
              Useful Links
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" mt={3} gap={2}>
              <Text color="#6A6A6A" textStyle="sm">
                About Us
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Who We are
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Privacy Policy
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Our Services
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Term and Conditions
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Projects
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Out Sitemap
              </Text>
              <Text color="#6A6A6A" textStyle="sm">
                Contact
              </Text>
            </Grid>
          </Box>
          <Box w={'full'}>
            <Text textStyle={'2xl'} fontWeight={'bold'}>
              Join Our Newsletter Now
            </Text>
            <Text mt={3} color="#6A6A6A" textStyle="sm">
              Get E-mail updates about our latest and special offers.
            </Text>

            <Flex mt={2} alignItems={'flex-end'} gap={2}>
              <Field label="Email">
                <Input placeholder="Email" bg="white" />
              </Field>
              <Button colorPalette={'primary'}>Subscribe</Button>
            </Flex>
          </Box>
        </Grid>
        <Box w={'full'} borderTop="1px solid #DCDCDC" pt={3} mt={5}>
          <Text color="#989898" textStyle={'sm'}>
            Copyright 2025 All rights reserved | EMS (PVT) LTD
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Landing;
