import React, { FC, useEffect } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  ICommonType,
  ICreateAgentForm,
  ICreateAgentPayload,
  IUpdateAgentPayload,
} from '../../../common/interfaces';
import { toaster } from '../../../components/ui/toaster';
import { createAgent, updateAgent } from '../../../services/admin';
import {
  createListCollection,
  Flex,
  Grid,
  Input,
  Text,
} from '@chakra-ui/react';
import { Field } from '../../../components/ui/field';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../../components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { RootState } from '../../../redux/rootReducer';
import { fetchAccessPoints } from '../../../redux/slices/accesspointSlice';
import { Button } from '../../../components/ui/button';

interface IAgentModalForm {
  open: boolean;
  toggle: () => void;
  getData: () => void;
  agent?: IUpdateAgentPayload;
  isUpdate?: boolean;
}

const AgentForm: FC<IAgentModalForm> = ({
  open,
  isUpdate,
  getData,
  toggle,
  agent,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessPoints } = useSelector(
    (state: RootState) => state.accessPoints,
  );

  useEffect(() => {
    dispatch(fetchAccessPoints());
  }, [dispatch]);

  const allAccessPoints = createListCollection({
    items: accessPoints?.map((dis: ICommonType) => ({
      label: dis.name,
      value: dis.id.toString(),
    })),
  });

  const statuses = createListCollection({
    items: [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Inactive', value: 'INACTIVE' },
    ],
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICreateAgentForm>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ICreateAgentForm> = async (data) => {
    try {
      if (isUpdate) {
        const payload: IUpdateAgentPayload = {
          id: agent?.id!,
          status: data?.status[0],
          accessPointId: Number(data.accessPointId[0]),
          contactNumber: data.contactNumber,
          email: data.email,
          name: data.name,
        };
        await updateAgent(payload);
        toaster.create({
          description: 'Agent update successful!',
          type: 'success',
        });
      } else {
        const payload: ICreateAgentPayload = {
          accessPointId: Number(data.accessPointId[0]),
          contactNumber: data.contactNumber,
          email: data.email,
          name: data.name,
          status: data.status[0],
        };
        const res = await createAgent(payload);

        if (res.statusCode === 201) {
          toaster.create({
            description: 'Agent creation successful!',
            type: 'success',
          });
        }
      }
      reset({
        accessPointId: [''],
        contactNumber: '',
        email: '',
        name: '',
      });
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
        accessPointId: [agent?.accessPointId.toString()],
        status: [agent?.status.toString()],
        contactNumber: agent?.contactNumber || '',
        email: agent?.email || '',
        name: agent?.name || '',
      });
    }
    return () => {
      reset({
        accessPointId: [''],
        contactNumber: '',
        email: '',
        name: '',
        status: [''],
      });
    };
  }, [agent, isUpdate, reset]);

  return (
    <DialogRoot
      lazyMount
      open={open}
      placement="center"
      size={{ base: 'xs', md: 'md' }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update' : 'Create'} Agent</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
              <Field label="Name">
                <Input
                  id="name"
                  placeholder="Agent Name"
                  {...register('name', {
                    required: 'Agent Name is required',
                    minLength: {
                      value: 3,
                      message: 'Agent Name must be at least 3 characters long',
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
              <Field label="Email">
                <Input
                  id="email"
                  placeholder="me@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    minLength: {
                      value: 3,
                      message: 'Email must be at least 3 characters long',
                    },
                  })}
                  bg="white"
                  borderColor="secondary.200"
                  _focus={{ borderColor: 'none', outline: 'none' }}
                />
                <Text fontSize="xs" color="red.600">
                  {errors.email && errors.email.message}
                </Text>
              </Field>
              <Field label="Contact">
                <Input
                  id="contact"
                  placeholder="Contact number"
                  type="tel"
                  {...register('contactNumber', {
                    required: 'Contact number is required',
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
                  {errors.contactNumber && errors.contactNumber.message}
                </Text>
              </Field>
              <Controller
                control={control}
                name="accessPointId"
                rules={{ required: 'Access Point is required' }}
                render={({ field }) => (
                  <Field label="Access Point">
                    <SelectRoot
                      id={field.name}
                      name={field.name}
                      collection={allAccessPoints}
                      bg="white"
                      borderColor="secondary.200"
                      onValueChange={({ value }) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select Access Point" />
                      </SelectTrigger>
                      <SelectContent portalled={false}>
                        {allAccessPoints?.items?.map((item) => (
                          <SelectItem item={item} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                    <Text fontSize="xs" color="red.600">
                      {errors.accessPointId && errors.accessPointId.message}
                    </Text>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="status"
                rules={{ required: 'Status required' }}
                render={({ field }) => (
                  <Field label="Status">
                    <SelectRoot
                      id={field.name}
                      name={field.name}
                      collection={statuses}
                      bg="white"
                      borderColor="secondary.200"
                      onValueChange={({ value }) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent portalled={false}>
                        {statuses?.items?.map((item) => (
                          <SelectItem item={item} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                    <Text fontSize="xs" color="red.600">
                      {errors.accessPointId && errors.accessPointId.message}
                    </Text>
                  </Field>
                )}
              />
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

export default AgentForm;
