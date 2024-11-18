import { Box, Divider, Grid, IconButton, Stack } from '@mui/material';
import { Edit3, Trash2 } from 'lucide-react';
import { ShadowCard } from '../base/base-card';
import { BaseAlertDialog } from '../base/base-alert-dialog';
import { useRef, useState } from 'react';
import { useMoon } from '@/hooks/use-moon';
import useLockFn from 'ahooks/lib/useLockFn';
import { ProxyEditDialog, ProxyEditDialogRef } from './proxy-edit-dialog';

interface Props {
  current?: string,
  node: IMoonProxy
}

const ProxyItem = (props: Props) => {
  const { current, node } = props;

  const proxyEditDialogRef = useRef<ProxyEditDialogRef>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const { deleteProxy } = useMoon();

  const handleDelete = useLockFn(async () => {
    await deleteProxy(node);
    setDeleteOpen(false);
  })

  const adpativeStyles = node.uid === current && { fontWeight: "500", color: "var(--text-primary)" };
  return (
    <ShadowCard sx={{ padding: "15px 10px", fontSize: "16px", ...adpativeStyles }} >
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" >
          <Box style={{ fontSize: "20px" }}>
            {node.name}
          </Box>
          <Box>
            <IconButton>
              <Trash2 size={16} onClick={() => setDeleteOpen(true)} />
            </IconButton>
            <IconButton>
              <Edit3 size={16} onClick={() => proxyEditDialogRef.current?.edit(node)} />
            </IconButton>
          </Box>
        </Stack>
        <Divider flexItem sx={{ marginTop: "10px", marginBottom: "10px" }} />
        <Grid container rowSpacing={1} columnSpacing={4} >
          <Grid item xs={6}>
            <span>地址：</span><span>{node.host}</span>
          </Grid>
          <Grid item xs={6}>
            <span>端口：</span><span>{node.port}</span>
          </Grid>
          <Grid item xs={6}>
            <span>协议：</span><span>{node.scheme}</span>
          </Grid>
          <Grid item xs={6}>
            <span>认证：</span><span>{node.username ? '有' : '无'}</span>
          </Grid>
        </Grid>
      </Stack>
      <BaseAlertDialog open={deleteOpen} title='警告' message='是否删除此节点？' onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} />
      <ProxyEditDialog ref={proxyEditDialogRef} />
    </ShadowCard>
  )
}

export default ProxyItem;