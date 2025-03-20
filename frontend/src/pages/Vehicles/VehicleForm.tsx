import { useEffect, useState } from 'react';
import {
  Box,
  createListCollection,
  Grid,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Field } from '../../components/ui/field';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleTypes } from '../../redux/slices/vehicleTypeSlice';
import { fetchBrands } from '../../redux/slices/brandsSlice';
import { fetchFuelTypes } from '../../redux/slices/fuelTypeSlice';
import {
  ICommonType,
  IVehicle,
  IVehiclePayload,
} from '../../common/interfaces';
import {
  createVehicle,
  getVehicle,
  updateVehicle,
} from '../../services/vehicles';
import { toaster } from '../../components/ui/toaster';

interface VehicleFormInputs {
  registrationNumber: string;
  manufacturedYear: string;
  registeredYear: string;
  brand: string[];
  category: string[];
  fuelType: string[];
}

interface VehicleFormInputs {
  registrationNumber: string;
  manufacturedYear: string;
  registeredYear: string;
  brand: string[];
  category: string[];
  fuelType: string[];
}

const VehicleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: vehicleId } = useParams();
  const isUpdate = location.pathname.includes('/vehicles/update');

  const dispatch = useDispatch<AppDispatch>();
  const { vehicleTypes } = useSelector(
    (state: RootState) => state.vehicleTypes,
  );
  const { brands } = useSelector((state: RootState) => state.brands);
  const { fuelTypes } = useSelector((state: RootState) => state.fuelTypes);

  const [vehicleID, setVehicleID] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchVehicleTypes());
    dispatch(fetchBrands());
    dispatch(fetchFuelTypes());
  }, [dispatch]);

  const getVehicleData = async (
    id: string,
  ): Promise<VehicleFormInputs | undefined> => {
    try {
      const res = await getVehicle(id);

      const vehicleData: IVehicle = res.data;

      setVehicleID(vehicleData.id);
      return {
        brand: [vehicleData.brand.id.toString()],
        category: [vehicleData.vehicleType.id.toString()],
        fuelType: [vehicleData.fuelType.id.toString()],
        manufacturedYear: vehicleData.manufacturedYear,
        registeredYear: vehicleData.registeredYear,
        registrationNumber: vehicleData.registrationNumber,
      };
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VehicleFormInputs>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<VehicleFormInputs> = async (data) => {
    const userData = localStorage.getItem('user');
    const parsedData = JSON.parse(userData!);

    const payload: IVehiclePayload = {
      manufacturedYear: data.manufacturedYear,
      registeredYear: data.registeredYear,
      registrationNumber: data.registrationNumber,
      brand: {
        id: Number(data.brand[0]),
      },
      fuelType: {
        id: Number(data.fuelType[0]),
      },
      vehicleType: {
        id: Number(data.category[0]),
      },
      customerEmail: parsedData.email,
    };

    try {
      if (isUpdate) {
        const res = await updateVehicle(payload, vehicleID!);

        if (res.statusCode === 200) {
          toaster.create({
            description: 'Vehicle update successful!',
            type: 'success',
          });
          getVehicleData(vehicleId!);
        }
      } else {
        const res = await createVehicle(payload);

        if (res.statusCode === 201) {
          toaster.create({
            description: 'Vehicle creation successful!',
            type: 'success',
          });
          reset({
            registrationNumber: '',
            manufacturedYear: '',
            registeredYear: '',
            brand: [],
            category: [],
            fuelType: [],
          });
        }
      }
      navigate('/vehicles');
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const allBrands = createListCollection({
    items: brands.map((dis: ICommonType) => ({
      label: dis.name,
      value: dis.id.toString(),
    })),
  });

  const allVehicleTypes = createListCollection({
    items: vehicleTypes.map((dis: ICommonType) => ({
      label: dis.name,
      value: dis.id.toString(),
    })),
  });

  const allFuelTypes = createListCollection({
    items: fuelTypes.map((dis: ICommonType) => ({
      label: dis.name,
      value: dis.id.toString(),
    })),
  });

  useEffect(() => {
    if (vehicleId && isUpdate) {
      (async () => {
        const data = await getVehicleData(vehicleId);
        reset(data);
      })();
    }
  }, [vehicleId, isUpdate, reset]);

  return (
    <Box lgDown={{ p: 5 }} lg={{ px: 28, py: 12 }} xl={{ px: 32, py: 12 }}>
      <Text
        textAlign={{ base: 'center', md: 'left' }}
        fontSize="3xl"
        fontWeight="bold"
        mb={5}
      >
        {isUpdate ? 'Update Vehicles' : 'Register Vehicles'}
      </Text>
      <Box w="full" mt={4} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
            <Field label="Registration Number">
              <Input
                disabled={isUpdate}
                id="registerNumber"
                placeholder="Registration Number"
                {...register('registrationNumber', {
                  required: 'Registration number is required',
                  minLength: {
                    value: 3,
                    message:
                      'Registration Number must be at least 3 characters long',
                  },
                })}
                bg="white"
                borderColor="secondary.200"
                _focus={{ borderColor: 'none', outline: 'none' }}
              />
              <Text fontSize="xs" color="red.600">
                {errors.registrationNumber && errors.registrationNumber.message}
              </Text>
            </Field>
            <Field label="Manufactured Year">
              <Input
                type="number"
                id="mYear"
                placeholder="Manufactured Year"
                {...register('manufacturedYear', {
                  required: 'Manufactured year is required',
                  minLength: {
                    value: 3,
                    message:
                      'Manufactured Year must be at least 3 characters long',
                  },
                })}
                bg="white"
                borderColor="secondary.200"
                _focus={{ borderColor: 'none', outline: 'none' }}
              />
              <Text fontSize="xs" color="red.600">
                {errors.manufacturedYear && errors.manufacturedYear.message}
              </Text>
            </Field>
            <Field label="Registered Year">
              <Input
                type="number"
                id="rYear"
                placeholder="Registered Year"
                {...register('registeredYear', {
                  required: 'Registered year is required',
                  minLength: {
                    value: 3,
                    message:
                      'Registered Year must be at least 3 characters long',
                  },
                })}
                bg="white"
                borderColor="secondary.200"
                _focus={{ borderColor: 'none', outline: 'none' }}
              />
              <Text fontSize="xs" color="red.600">
                {errors.registeredYear && errors.registeredYear.message}
              </Text>
            </Field>
            <Controller
              control={control}
              name="brand"
              rules={{ required: 'Brand is required' }}
              render={({ field }) => (
                <Field label="Brand">
                  <SelectRoot
                    id={field.name}
                    name={field.name}
                    collection={allBrands}
                    bg="white"
                    borderColor="secondary.200"
                    onValueChange={({ value }) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {allBrands.items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Text fontSize="xs" color="red.600">
                    {errors.brand && errors.brand.message}
                  </Text>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="category"
              rules={{ required: 'Vehicle category is required' }}
              render={({ field }) => (
                <Field label="Vehicle Category">
                  <SelectRoot
                    id={field.name}
                    name={field.name}
                    collection={allVehicleTypes}
                    bg="white"
                    borderColor="secondary.200"
                    onValueChange={({ value }) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Vehicle Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allVehicleTypes.items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Text fontSize="xs" color="red.600">
                    {errors.category && errors.category.message}
                  </Text>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="fuelType"
              rules={{ required: 'Fuel type is required' }}
              render={({ field }) => (
                <Field label="Fuel Type">
                  <SelectRoot
                    id={field.name}
                    name={field.name}
                    collection={allFuelTypes}
                    bg="white"
                    borderColor="secondary.200"
                    onValueChange={({ value }) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Fuel Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {allFuelTypes.items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Text fontSize="xs" color="red.600">
                    {errors.fuelType && errors.fuelType.message}
                  </Text>
                </Field>
              )}
            />
          </Grid>
          <HStack w="full" mt={6}>
            <Button
              w="50%"
              onClick={() => reset()}
              colorPalette="red"
              type="button"
            >
              Clear
            </Button>
            <Button
              w="50%"
              loading={isSubmitting}
              colorPalette="cyan"
              type="submit"
            >
              {isUpdate ? 'Update' : 'Register'}
            </Button>
          </HStack>
        </form>
      </Box>
    </Box>
  );
};

export default VehicleForm;
