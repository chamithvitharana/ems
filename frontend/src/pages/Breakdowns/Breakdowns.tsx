import React, { useEffect, useState } from 'react';
import {
  Box,
  createListCollection,
  Flex,
  Grid,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toaster } from '../../components/ui/toaster';
import { BreakDownPayload, IVehicle } from '../../common/interfaces';
import { getVehicles, reportBreakdown } from '../../services/vehicles';
import { Button } from '../../components/ui/button';
import { Field } from '../../components/ui/field';
import { getLocation } from '../../common/functions';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';

interface BreakDownInputs {
  vehicleNumber: string[];
  description: string;
}

const Breakdowns = () => {
  const { getUser } = useAuth();

  const [latLong, setLatLong] = useState<{ lat: string; long: string }>({
    lat: '',
    long: '',
  });

  const currentUser = getUser();

  const { data } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles(0, 100000, '', currentUser?.email!),
  });

  const allVehicles = createListCollection({
    items:
      data?.data?.content.map((dis: IVehicle) => ({
        label: dis.registrationNumber,
        value: dis.registrationNumber,
      })) || [],
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BreakDownInputs>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<BreakDownInputs> = async (data) => {
    try {
      const { lat, lon } = await getLocation();

      const payload: BreakDownPayload = {
        vehicleNumber: data.vehicleNumber[0],
        description: data.description,
        lat,
        lon,
      };

      const res = await reportBreakdown(payload);
      if (res.statusCode === 200) {
        toaster.create({
          description: 'Reported successfully!',
          type: 'success',
        });
        reset({ description: '', vehicleNumber: [''] });
      }
    } catch (error: any) {
      toaster.create({
        description: 'Please select a running vehicle!',
        type: 'error',
      });
    }
  };

  const getMarkerData = async () => {
    const { lat, lon } = await getLocation();

    setLatLong({
      lat,
      long: lon,
    });
  };

  useEffect(() => {
    getMarkerData();
  }, []);

  return (
    <Box
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
        Report a breakdown
      </Text>
      <Box w="full" mt={4} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
            <Controller
              control={control}
              name="vehicleNumber"
              rules={{ required: 'Vehicle is required' }}
              render={({ field }) => (
                <Field label="Vehicle">
                  <SelectRoot
                    id={field.name}
                    name={field.name}
                    collection={allVehicles}
                    bg="white"
                    borderColor="secondary.200"
                    onValueChange={({ value }) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent portalled={false}>
                      {allVehicles?.items?.map((item: any) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Text fontSize="xs" color="red.600">
                    {errors.vehicleNumber && errors.vehicleNumber.message}
                  </Text>
                </Field>
              )}
            />
            <Field label="Description">
              <Input
                id="description"
                placeholder="Description"
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 3,
                    message: 'Description must be at least 3 characters long',
                  },
                })}
                bg="white"
                borderColor="secondary.200"
                _focus={{ borderColor: 'none', outline: 'none' }}
              />
              <Text fontSize="xs" color="red.600">
                {errors.description && errors.description.message}
              </Text>
            </Field>
          </Grid>
          <Flex justify={'flex-end'}>
            <HStack mt={6}>
              <Button
                onClick={() => reset({ description: '', vehicleNumber: [''] })}
                colorPalette="red"
                type="button"
              >
                Clear
              </Button>
              <Button loading={isSubmitting} colorPalette="cyan" type="submit">
                Report
              </Button>
            </HStack>
          </Flex>
        </form>
        <>
          <Box mt={12} h={'300px'}>
            {latLong.lat && latLong.long && (
              <MapContainer
                center={[Number(latLong.lat), Number(latLong.long)]}
                zoom={9}
                scrollWheelZoom={false}
                style={{ height: '300px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[Number(latLong.lat), Number(latLong.long)]}>
                  <Tooltip
                    direction="top"
                    offset={[-15, -15]}
                    opacity={1}
                    permanent
                  >
                    Current Location
                  </Tooltip>
                </Marker>
              </MapContainer>
            )}
          </Box>
        </>
      </Box>
    </Box>
  );
};

export default Breakdowns;
