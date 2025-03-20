import React, { FC } from 'react';
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog';
import { Text } from '@chakra-ui/react';
import { Button } from '../ui/button';

interface IConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  cancel: () => void;
  confirm: () => void;
  submitBtn?: boolean;
  loading?: boolean;
  customSubmit?: string;
}

const ConfirmDialog: FC<IConfirmDialogProps> = ({
  open,
  title,
  message,
  cancel,
  confirm,
  submitBtn,
  loading,
  customSubmit,
}) => {
  return (
    <DialogRoot
      role="alertdialog"
      lazyMount
      open={open}
      placement="center"
      size={{ base: 'xs', md: 'md' }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text fontSize="lg">{message}</Text>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={cancel} variant="outline">
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            loading={loading}
            onClick={() => confirm()}
            colorPalette={submitBtn ? 'primary' : 'red'}
          >
            {submitBtn ? `${customSubmit || 'Confirm'}` : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmDialog;
