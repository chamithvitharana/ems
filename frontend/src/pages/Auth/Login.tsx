import React, { useState } from 'react';
import { Box, Flex, Text, Input, Group, InputAddon } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Field } from '../../components/ui/field';
import { PasswordInput } from '../../components/ui/password-input';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../components/ui/toaster';
import { LuUser } from 'react-icons/lu';
import { IoKeyOutline } from 'react-icons/io5';
import { login } from '../../services/auth';
import { ILoggedUser } from '../../common/interfaces';
import ResetPassword from './components/ResetPassword';
import { FcHome } from 'react-icons/fc';
import { Tooltip } from '../../components/ui/tooltip';

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ mode: 'onChange' });

  const [openResetPassword, setOpenResetPassword] = useState<boolean>(false);

  const toggleResetPasswordDialog = () => {
    setOpenResetPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await login(data);

      if (res.statusCode === 200) {
        const loggedUser: ILoggedUser = res.data;
        localStorage.setItem('accessToken', loggedUser.accessToken);
        localStorage.setItem('userRole', loggedUser.userRole);

        toaster.create({
          description: 'Login successful!',
          type: 'success',
        });

        if (loggedUser.userRole === 'ADMIN') {
          navigate('/admin-dashboard');
          return;
        }

        localStorage.setItem(
          'user',
          JSON.stringify(
            loggedUser.userRole === 'CUSTOMER'
              ? loggedUser.customer
              : loggedUser.agent,
          ),
        );

        navigate('/home');
      }
    } catch (error) {
      toaster.create({
        description: 'Invalid email or password',
        type: 'error',
      });
    }
  };

  return (
    <Flex alignItems="center" flexDir="column" w="full" h="full">
      <Text fontSize="lg" md={{ fontSize: '2xl' }} fontWeight="bold">
        Expressway Management System
      </Text>
      <Box w="full" mt={8} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap={5}>
            <Field label="Email">
              <Group w="full" attached>
                <InputAddon bg="cyan.600">
                  <LuUser color="white" />
                </InputAddon>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  {...register('username', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </Group>
              <Text fontSize="xs" color="red.600">
                {errors.username && errors.username.message}
              </Text>
            </Field>
            <Field label="Password">
              <Group w="full" attached>
                <InputAddon bg="cyan.600">
                  <IoKeyOutline color="white" />
                </InputAddon>
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                  })}
                />
              </Group>
              <Text fontSize="xs" color="red.600">
                {errors.password && errors.password.message}
              </Text>
            </Field>
            <Text
              fontSize="sm"
              color="cyan.600"
              textDecor="underline"
              cursor="pointer"
              fontWeight="bold"
              onClick={() => toggleResetPasswordDialog()}
            >
              Forgot Password?
            </Text>
            <Button
              loading={isSubmitting}
              colorPalette="cyan"
              type="submit"
              width="full"
              mt={3}
            >
              Login
            </Button>
            <Flex justify="center" alignItems="center" gap={1} mt={6}>
              <Text fontSize="sm">Don't you have an account?</Text>
              <Text
                fontSize="sm"
                color="cyan.600"
                textDecor="underline"
                cursor="pointer"
                fontWeight="bold"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Text>
            </Flex>
          </Flex>
        </form>
      </Box>
      <Tooltip content="Back to home :)">
        <Flex
          mt={2}
          w={10}
          h={10}
          borderRadius="50%"
          shadow={'2px 4px 4px 2px #00000012'}
          justify={'center'}
          alignItems={'center'}
          cursor={'pointer'}
          _hover={{ bg: 'cyan.50' }}
          onClick={() => navigate('/')}
        >
          <FcHome size={20} />
        </Flex>
      </Tooltip>
      <ResetPassword
        open={openResetPassword}
        title="Reset Password"
        toggleModal={toggleResetPasswordDialog}
      />
    </Flex>
  );
};

export default Login;
