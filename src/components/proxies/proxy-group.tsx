import { useMoon } from "@/provider/moon";
import { Box, IconButton, Stack } from "@mui/material";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { ProxyEditDialog, ProxyEditDialogRef } from "./proxy-edit-dialog";
import ProxyList from "./proxy-list";

//本地节点
export const LocalProxies = () => {
  const proxyEditDialogRef = useRef<ProxyEditDialogRef>(null);

  const { moon } = useMoon();

  //群组ID为"0"的是本地节点
  const localGroup = moon?.proxy_group_list?.find((e) => e.uid === "0");
  const nodeList: IMoonProxy[] = localGroup?.proxy_list || [];

  if (nodeList.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}>
        <IconButton
          color="primary"
          disableRipple
          sx={{ marginTop: "-30px" }}
          onClick={() => proxyEditDialogRef.current?.create()}>
          <Plus size={36} />
          <span style={{ fontSize: "20px", marginLeft: "8px" }}>本地节点</span>
        </IconButton>
        <ProxyEditDialog ref={proxyEditDialogRef} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", overflowY: "auto", padding: "0 3px" }}>
      <Stack direction="row" justifyContent="flex-end" marginBottom={"-8px"}>
        <IconButton
          color="primary"
          disableRipple
          sx={{ paddingRight: "10px" }}
          onClick={() => proxyEditDialogRef.current?.create()}>
          <Plus />
        </IconButton>
      </Stack>
      <ProxyList nodeList={nodeList} />
      <ProxyEditDialog ref={proxyEditDialogRef} />
    </Box>
  );
};
