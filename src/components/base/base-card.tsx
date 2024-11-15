import { Box, SxProps, Theme } from '@mui/material'
import React from 'react'

interface Props {
  children: React.ReactNode,
  sx?: SxProps<Theme>;
}
export function ShadowCard(props: Props) {
  const { children, sx } = props
  return (
    <Box sx={{ borderRadius: "5px", borderColor: "0xFFF0F0F0", borderWidth: "0.5px", boxShadow: "0px 0px 5px #EEEEEE ", ...sx }}>
      {children}
    </Box>
  )
}