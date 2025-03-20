import React, { FC, useEffect } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Flex, Grid, Input, Text } from '@chakra-ui/react';
import { Field } from '../../../components/ui/field';
import { toaster } from '../../../components/ui/toaster';
import { createAccessPoint, updateAccessPoint } from '../../../services/admin';
import {
  IAccessPointInputs,
  IUpdateAccessPointInputs,
} from '../../../common/interfaces';

interface IAccessModalForm {
  open: boolean;
  toggle: () => void;
  getData: () => void;
  accessPoint?: IUpdateAccessPointInputs;
  isUpdate?: boolean;
}

const AccessModalForm: FC<IAccessModalForm> = ({
  open,
  toggle,
  getData,
  accessPoint,
  isUpdate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IAccessPointInputs>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<IAccessPointInputs> = async (data) => {
    try {
      if (isUpdate) {
        const payload: IUpdateAccessPointInputs = {
          id: accessPoint?.id!,
          ...data,
        };
        await updateAccessPoint(payload);
        toaster.create({
          description: 'Access Point update successful!',
          type: 'success',
        });
      } else {
        const res = await createAccessPoint(data);

        if (res.statusCode === 201) {
          toaster.create({
            description: 'Access Point creation successful!',
            type: 'success',
          });
        }
      }
      reset();
      toggle();
      getData();
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (isUpdate) {
      reset({
        code: accessPoint?.code || '',
        name: accessPoint?.name || '',
        emergencyAlertEmail: accessPoint?.emergencyAlertEmail || '',
        emergencyAlertMobile: accessPoint?.emergencyAlertMobile || '',
        lat: accessPoint?.lat || undefined,
        lon: accessPoint?.lon || undefined,
      });
    }
    return () => {
      reset();
    };
  }, [accessPoint, isUpdate, reset]);

  return (
    <DialogRoot
      lazyMount
      open={open}
      placement="center"
      size={{ base: 'xs', md: 'md' }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Update' : 'Create'} Access Point
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
              <Field label="Name">
                <Input
                  id="apName"
                  placeholder="Access Point Name"
                  {...register('name', {
                    required: 'Access Point Name is required',
                    minLength: {
                      value: 3,
                      message:
                        'Access Point Name must be at least 3 characters long',
                    },
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.name && errors.name.message}
                </Text>
              </Field>
              <Field label="Code">
                <Input
                  id="code"
                  placeholder="Access Point Code"
                  {...register('code', {
                    required: 'Access Point Code is required',
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.code && errors.code.message}
                </Text>
              </Field>
              <Field label="Longitude">
                <Input
                  id="lon"
                  placeholder="Longitude"
                  type="number"
                  step="0.0000000001"
                  {...register('lon', {
                    required: 'Longitude is required',
                    valueAsNumber: true,
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.lon && errors.lon.message}
                </Text>
              </Field>
              <Field label="Latitude">
                <Input
                  id="lat"
                  placeholder="Latitude"
                  type="number"
                  step="0.0000000001"
                  {...register('lat', {
                    required: 'Latitude is required',
                    valueAsNumber: true,
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.lat && errors.lat.message}
                </Text>
              </Field>
              <Field label="Emergency Alert Email">
                <Input
                  id="emergencyAlertEmail"
                  placeholder="me@example.com"
                  type="email"
                  {...register('emergencyAlertEmail', {
                    required: 'Emergency Alert Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.emergencyAlertEmail &&
                    errors.emergencyAlertEmail.message}
                </Text>
              </Field>
              <Field label="Emergency Alert Mobile">
                <Input
                  id="emergencyAlertMobile"
                  placeholder="Emergency Alert Mobile"
                  type="tel"
                  {...register('emergencyAlertMobile', {
                    required: 'Emergency Alert Mobile is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid mobile number',
                    },
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.emergencyAlertMobile &&
                    errors.emergencyAlertMobile.message}
                </Text>
              </Field>
            </Grid>
            <Flex justify={'flex-end'} mt={4} gap={2}>
              <Button
                onClick={() => {
                  reset();
                  toggle();
                }}
                variant="outline"
              >
                Close
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                colorPalette="primary"
              >
                {isUpdate ? 'Update' : 'Create'}
              </Button>
            </Flex>
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AccessModalForm;
