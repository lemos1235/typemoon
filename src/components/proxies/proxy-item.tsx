import { useMoon } from "@/provider/moon";
import { Box, Grid2, IconButton, Stack } from "@mui/material";
import useLockFn from "ahooks/lib/useLockFn";
import { Edit3, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { BaseAlertDialog } from "../base/base-alert-dialog";
import { ShadowCard } from "../base/base-card";
import BaseDivider from "../base/base-divider";
import { ProxyEditDialog, ProxyEditDialogRef } from "./proxy-edit-dialog";

interface Props {
  node: IMoonProxy;
}

const ProxyItem = (props: Props) => {
  const { node } = props;

  const proxyEditDialogRef = useRef<ProxyEditDialogRef>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const { moon, deleteProxy } = useMoon();

  const openDelete = () => {
    // 检查当前节点是否关联某个规则
    const isRelated =
      moon?.rule_list?.some(
        (r) => r.action === node.group_uid + ":" + node.uid,
      ) ?? false;
    if (isRelated) {
      setAlertOpen(true);
    } else {
      setDeleteOpen(true);
    }
  };

  const handleDelete = useLockFn(async () => {
    await deleteProxy(node);
    setDeleteOpen(false);
  });

  return (
    <ShadowCard sx={{ width: "100%", fontSize: "16px" }}>
      <Stack spacing={{ padding: "15px 10px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Box style={{ fontSize: "18px" }}>{node.name}</Box>
          <Box>
            <IconButton onClick={() => openDelete()}>
              <Trash2 size={16} />
            </IconButton>
            <IconButton onClick={() => proxyEditDialogRef.current?.edit(node)}>
              <Edit3 size={16} />
            </IconButton>
          </Box>
        </Stack>
        <BaseDivider
          flexItem
          sx={{ marginTop: "10px", marginBottom: "10px" }}
        />
        <Grid2 container rowSpacing={1} columnSpacing={4}>
          <Grid2 size={{ xs: 6 }}>
            <span>地址：</span>
            <span>{node.host}</span>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <span>端口：</span>
            <span>{node.port}</span>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <span>协议：</span>
            <span>{node.scheme}</span>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <span>认证：</span>
            <span>{node.username ? "有" : "无"}</span>
          </Grid2>
        </Grid2>
      </Stack>
      <BaseAlertDialog
        open={deleteOpen}
        title="警告"
        message="是否删除此节点？"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      <BaseAlertDialog
        open={alertOpen}
        title="警告"
        message="已有规则关联到此节点"
        onConfirm={() => setAlertOpen(false)}
      />
      <ProxyEditDialog ref={proxyEditDialogRef} />
    </ShadowCard>
  );
};

export default ProxyItem;
