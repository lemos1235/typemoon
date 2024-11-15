import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProxyEditDialog(props: Props) {
  const { open = false, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogContent
        sx={{
          width: "auto",
          height: "calc(100vh - 185px)",
          overflow: "hidden",
        }} >
      </DialogContent>
    </Dialog>
  )
}