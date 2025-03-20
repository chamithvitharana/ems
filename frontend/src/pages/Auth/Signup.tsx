import React from 'react';
import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Field } from '../../components/ui/field';
import { PasswordInput } from '../../components/ui/password-input';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { SignupFormInputs, SignupFormPayload } from '../../common/interfaces';
import { toaster } from '../../components/ui/toaster';
import { signup } from '../../services/auth';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentMethod } from '@stripe/stripe-js';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const Signup = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [hasCardDetails, setHasCardDetails] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
  } = useForm<SignupFormInputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      let paymentId = '';

      if (stripe && elements && hasCardDetails) {
        const { paymentMethod, error } = await handleCardElements();
        if (error) {
          return;
        }
        paymentId = paymentMethod?.id || '';
      }

      const payload: SignupFormPayload = {
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

      const res = await signup(payload);

      if (res) {
        toaster.create({
          description: 'Signed up successfully',
          type: 'success',
        });
        navigate('/login');
      }
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const password = watch('password');

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
    <Flex alignItems="center" flexDir="column" w="full" h="full">
      <Text fontSize="lg" md={{ fontSize: '2xl' }} fontWeight="bold">
        Sign Up
      </Text>
      <Box w="full" mt={4} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
            <Field label="Email">
              <Input
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
                id="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                {...register('addressLine2')}
              />
            </Field>
            <Field label="Mobile">
              <Input
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
              />
              <Text fontSize="xs" color="red.600">
                {errors.password && errors.password.message}
              </Text>
            </Field>
            <Field label="Confirm Password">
              <PasswordInput
                id="confirmPassword"
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.confirmPassword && errors.confirmPassword.message}
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
            Sign Up
          </Button>
          <Flex justify="center" alignItems="center" gap={1} mt={3}>
            <Text fontSize="sm">Already have an account?</Text>
            <Text
              fontSize="sm"
              color="cyan.600"
              textDecor="underline"
              cursor="pointer"
              fontWeight="bold"
              onClick={() => navigate('/login')}
            >
              Login
            </Text>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default Signup;
