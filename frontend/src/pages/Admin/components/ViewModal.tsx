import React, { FC, ReactNode } from "react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

interface IViewModalProps {
  open: boolean;
  title: string;
  body: ReactNode;
  confirm: () => void;
}

const ViewModal: FC<IViewModalProps> = ({ open, confirm, body, title }) => {
  return (
    <DialogRoot
      lazyMount
      open={open}
      placement="center"
      size={{ base: "xs", md: "md" }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{body}</DialogBody>
        <DialogFooter>
          <Button onClick={() => confirm()} colorPalette="primary">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ViewModal;
