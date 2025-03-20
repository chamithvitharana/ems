import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { ICustomer, IUpdateProfile } from '../../common/interfaces';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toaster } from '../../components/ui/toaster';
import { Field } from '../../components/ui/field';
import { Switch } from '../../components/ui/switch';
import { PasswordInput } from '../../components/ui/password-input';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/agent';
import { useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { PaymentMethod } from '@stripe/stripe-js';

const UpdateProfile = () => {
  const { getUser } = useAuth();
  const currentUser: ICustomer = getUser();
  const stripe = useStripe();
  const elements = useElements();

  const [hasCardDetails, setHasCardDetails] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<IUpdateProfile>({ mode: 'onChange' });

  useEffect(() => {
    if (currentUser) {
      reset({
        email: currentUser.email,
        name: currentUser.name,
        nic: currentUser.nic,
        phoneNumber: currentUser.contactNumber,
        addressLine1: currentUser.addressLine1,
        addressLine2: currentUser.addressLine2,
        birthday: new Date(currentUser.birthday!).toISOString(),
        emailAlertEnabled: currentUser.emailNotificationEnabled,
        smsAlertEnabled: currentUser.smsNotificationEnabled,
        paymentId: currentUser.paymentId!,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const onSubmit: SubmitHandler<IUpdateProfile> = async (data) => {
    try {
      let paymentId = '';

      if (stripe && elements && hasCardDetails) {
        const { paymentMethod, error } = await handleCardElements();
        if (error) {
          return;
        }
        paymentId = paymentMethod?.id || '';
      }

      const payload = {
        email: data.email,
        name: data.name,
        nic: data.nic,
        phoneNumber: data.phoneNumber,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        birthday: new Date(data.birthday).toISOString(),
        emailAlertEnabled: data.emailAlertEnabled,
        smsAlertEnabled: data.smsAlertEnabled,
        password: data.password,
        paymentId,
      };

      const res = await updateUserProfile(payload);

      if (res) {
        toaster.create({
          description: 'Profile updated successfully!',
          type: 'success',
        });
        navigate('/home');
      }
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const handleCardElements = async (): Promise<{
    paymentMethod?: PaymentMethod;
    error?: string;
  }> => {
    try {
      if (!stripe || !elements)
        return { error: 'Stripe or Elements are not initialized' };

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return { error: 'Card element is not present' };

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        card: cardElement,
        type: 'card',
      });

      if (error) {
        return { error: error.message };
      } else {
        return { paymentMethod };
      }
    } catch (error) {
      return { error: 'Uncaught Error!' };
    }
  };

  return (
    <Flex
      flexDir="column"
      lgDown={{ p: 5 }}
      lg={{ px: 52, py: 12 }}
      xl={{ px: 52, py: 12 }}
    >
      <Text fontSize="lg" md={{ fontSize: '2xl' }} fontWeight="bold">
        Update Profile
      </Text>
      <Box w="full" mt={4} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
            <Field label="Email">
              <Input
                bg="white"
                disabled
                id="email"
                type="email"
                placeholder="me@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.email && errors.email.message}
              </Text>
            </Field>
            <Field label="Name">
              <Input
                bg="white"
                id="name"
                placeholder="John Doe"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters long',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.name && errors.name.message}
              </Text>
            </Field>
            <Field label="NIC">
              <Input
                bg="white"
                id="nic"
                placeholder="123456789V"
                {...register('nic', {
                  required: 'NIC is required',
                  pattern: {
                    value: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
                    message: 'Invalid NIC format',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.nic && errors.nic.message}
              </Text>
            </Field>
            <Field label="Address Line 1">
              <Input
                bg="white"
                id="addressLine1"
                placeholder="123 Main Street"
                {...register('addressLine1', {
                  required: 'Address line 1 is required',
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.addressLine1 && errors.addressLine1.message}
              </Text>
            </Field>
            <Field label="Address Line 2">
              <Input
                bg="white"
                id="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                {...register('addressLine2')}
              />
            </Field>
            <Field label="Mobile">
              <Input
                bg="white"
                id="mobile"
                type="tel"
                placeholder="0712345678"
                {...register('phoneNumber', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Invalid mobile number format',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.phoneNumber && errors.phoneNumber.message}
              </Text>
            </Field>
            <Field label="Birthday">
              <Input
                bg="white"
                id="birthday"
                type="date"
                placeholder="1995/06/15"
                {...register('birthday', {
                  valueAsDate: true,
                  required: 'Birthday is required',
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.birthday && errors.birthday.message}
              </Text>
            </Field>
            <Flex gap={2}>
              <Controller
                name="emailAlertEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    colorPalette="green"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                    inputProps={{ onBlur: field.onBlur }}
                  >
                    Email Alerts
                  </Switch>
                )}
              />
              <Controller
                name="smsAlertEnabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    colorPalette="green"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                    inputProps={{ onBlur: field.onBlur }}
                  >
                    SMS Alerts
                  </Switch>
                )}
              />
            </Flex>
            <Field label="Password">
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
                bg="white"
              />
              <Text fontSize="xs" color="red.600">
                {errors.password && errors.password.message}
              </Text>
            </Field>
          </Grid>
          <Grid mt={3}>
            {hasCardDetails ? (
              <React.Fragment>
                <Flex justify={'space-between'} alignItems={'center'}>
                  <Field label="Card Details" />
                  <IoIosCloseCircleOutline
                    cursor={'pointer'}
                    onClick={() => setHasCardDetails(false)}
                  />
                </Flex>
                <Box
                  h={'40px'}
                  border="1px solid"
                  borderColor={'gray.100'}
                  py={2.5}
                  px={4}
                  alignItems={'center'}
                >
                  <CardElement />
                </Box>
              </React.Fragment>
            ) : (
              <Button
                onClick={() => setHasCardDetails(true)}
                variant={'outline'}
              >
                Add Card Details
              </Button>
            )}
          </Grid>
          <Button
            loading={isSubmitting}
            colorPalette="cyan"
            type="submit"
            width="full"
            mt={4}
          >
            Update
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default UpdateProfile;
