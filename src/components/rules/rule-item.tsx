import { BaseAlertDialog } from "@/components/base/base-alert-dialog";
import { ShadowCard } from "@/components/base/base-card";
import { useMoon } from "@/provider/moon";
import { Box, Grid2, IconButton, Stack } from "@mui/material";
import { useLockFn } from "ahooks";
import { Edit3, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import BaseDivider from "../base/base-divider";
import { RuleEditDialog, RuleEditDialogRef } from "./rule-edit-dialog";

interface Props {
  rule: IMoonRule;
}

const RuleItem = (props: Props) => {
  const { rule } = props;

  const ruleEditDialogRef = useRef<RuleEditDialogRef>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const { moon, deleteRule } = useMoon();

  const handleDelete = useLockFn(async () => {
    await deleteRule(rule);
    setDeleteOpen(false);
  });
  const proxyList =
    moon?.proxy_group_list?.reduce((acc, g) => {
      if (!g.proxy_list) {
        return acc;
      } else {
        const groupProxyList = g.proxy_list.map((p) => ({
          ...p,
          groupName: g.name,
        }));
        return [...acc, ...groupProxyList];
      }
    }, [] as IMoonProxy[]) ?? [];

  let ruleName = rule.name;

  let ruleProcess = rule.process;
  if (ruleProcess === "MATCH") {
    ruleProcess = "全部";
  }

  let ruleAction;
  let actionProxy = proxyList.find(
    (p) => p.group_uid + ":" + p.uid === rule.action,
  );
  if (actionProxy) {
    ruleAction = actionProxy.name;
  } else {
    switch (rule.action) {
      case "DIRECT":
        ruleAction = "直连";
        break;
      case "REJECT":
        ruleAction = "拒绝";
        break;
      default:
        ruleAction = rule.action;
    }
  }

  return (
    <ShadowCard sx={{ width: "100%", fontSize: "16px" }}>
      <Stack sx={{ padding: "15px 10px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Box style={{ fontSize: "18px" }}>{ruleName}</Box>
          <Box>
            <IconButton
              onClick={() => setDeleteOpen(true)}
              disabled={rule.process === "MATCH"}>
              <Trash2 size={16} />
            </IconButton>
            <IconButton onClick={() => ruleEditDialogRef.current?.edit(rule)}>
              <Edit3 size={16} />
            </IconButton>
          </Box>
        </Stack>
        <BaseDivider
          flexItem
          sx={{ marginTop: "10px", marginBottom: "10px" }}
          style={{}}
        />
        <Grid2 container rowSpacing={1} columnSpacing={4}>
          <Grid2 size={{ xs: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span>程序：</span>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  maxWidth: "50%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {ruleProcess}
              </Box>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <span>操作：</span>
            <span>{ruleAction}</span>
          </Grid2>
        </Grid2>
      </Stack>
      <BaseAlertDialog
        open={deleteOpen}
        title="警告"
        message="是否删除此规则？"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      <RuleEditDialog ref={ruleEditDialogRef} />
    </ShadowCard>
  );
};

export default RuleItem;
