import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const BaseAlertDialog = (props: Props) => {
  const { open, title, message, onClose, onConfirm } = props;

  useEffect(() => {
    if (!open) return;
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ pb: 1, userSelect: "text" }}>
        {message}
      </DialogContent>

      <DialogActions>
        {onClose && (
          <Button onClick={onClose} variant="outlined">
            {"取消"}
          </Button>
        )}
        {onConfirm && (
          <Button onClick={onConfirm} variant="contained">
            {"确认"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
