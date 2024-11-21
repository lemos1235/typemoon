import { useRef, useState } from "react";
import { RuleEditDialog, RuleEditDialogRef } from "./rule-edit-dialog";
import { useMoon } from "@/hooks/use-moon";
import { useLockFn } from "ahooks";
import { ShadowCard } from "@/components/base/base-card";
import { Box, Divider, Grid, IconButton, Stack } from "@mui/material";
import { Edit3, Trash2 } from "lucide-react";
import { BaseAlertDialog } from "@/components/base/base-alert-dialog";

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
    ruleProcess = "默认";
  }

  let ruleAction;
  let actionProxy = proxyList.find((p) => p.uid === rule.action);
  if (actionProxy) {
    ruleAction = (actionProxy as any).groupName + " - " + actionProxy.label;
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
    <ShadowCard sx={{ width: "100%", padding: "15px 10px", fontSize: "16px" }}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box style={{ fontSize: "20px" }}>{ruleName}</Box>
          <Box>
            <IconButton
              onClick={() => setDeleteOpen(true)}
              disabled={rule.process === "MATCH"}
            >
              <Trash2 size={16} />
            </IconButton>
            <IconButton onClick={() => ruleEditDialogRef.current?.edit(rule)}>
              <Edit3 size={16} />
            </IconButton>
          </Box>
        </Stack>
        <Divider flexItem sx={{ marginTop: "10px", marginBottom: "10px" }} />
        <Grid container rowSpacing={1} columnSpacing={4}>
          <Grid item xs={6}>
            <span>程序：</span>
            <span>{ruleProcess}</span>
          </Grid>
          <Grid item xs={6}>
            <span>操作：</span>
            <span>{ruleAction}</span>
          </Grid>
        </Grid>
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
