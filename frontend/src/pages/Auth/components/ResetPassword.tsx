import React, { FC, useState } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input, Text } from '@chakra-ui/react';
import { Field } from '../../../components/ui/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IResetPassword } from '../../../common/interfaces';
import { PasswordInput } from '../../../components/ui/password-input';
import { toaster } from '../../../components/ui/toaster';
import { resetPassword, sendResetCode } from '../../../services/auth';

interface IResetPasswordProps {
  open: boolean;
  title: string;
  toggleModal: () => void;
}

const ResetPassword: FC<IResetPasswordProps> = ({
  open,
  toggleModal,
  title,
}) => {
  const [isSubmittingGetCode, setIsSubmittingGetCode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
  } = useForm<IResetPassword>({ mode: 'onChange' });

  const handleGetCode = async () => {
    const isValid = await trigger('email');
    if (isValid) {
      setIsSubmittingGetCode(true);
      try {
        const email = getValues('email');
        const res = await sendResetCode(email);

        if (res.statusCode === 200) {
          toaster.create({
            description: 'Code sent!',
            type: 'success',
          });
        }
      } catch (error: any) {
        toaster.create({
          description: error?.message || 'Uncaught Error!',
          type: 'error',
        });
      } finally {
        setIsSubmittingGetCode(false);
      }
    }
  };

  const handleReset: SubmitHandler<IResetPassword> = async (data) => {
    try {
      const res = await resetPassword(data.email, data.code, data.password);

      if (res.statusCode === 200) {
        toaster.create({
          description: 'Password reset successful!',
          type: 'success',
        });
        toggleModal();
      }
    } catch (error: any) {
      toaster.create({
        description: error?.message || 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  return (
    <DialogRoot
      lazyMount
      open={open}
      placement="center"
      size={{ base: 'xs', md: 'md' }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form autoComplete="off" onSubmit={handleSubmit(handleReset)}>
          <DialogBody>
            <Field label="Email">
              <Input
                autoComplete="off"
                id="resetEmail"
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
            <Field label="Code">
              <Input
                id="code"
                type="code"
                placeholder="Code"
                {...register('code', {
                  required: 'Code is required',
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.code && errors.code.message}
              </Text>
            </Field>
            <Field label="Password">
              <PasswordInput
                id="resetPassword"
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
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => toggleModal()} variant={'outline'}>
              Close
            </Button>
            <Button
              type="button"
              colorPalette={'black'}
              onClick={handleGetCode}
              loading={isSubmittingGetCode}
            >
              Get Code
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              colorPalette={'primary'}
            >
              Reset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

export default ResetPassword;
