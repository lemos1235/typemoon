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
    moon?.proxy_group_list?.reduce(
      (acc, g) => (g.proxy_list ? [...acc, ...g.proxy_list] : acc),
      [] as IMoonProxy[]
    ) ?? [];

  const ruleAction =
    proxyList.find((p) => p.uid === rule.action)?.name || rule.action;

  return (
    <ShadowCard sx={{ width: "100%", padding: "15px 10px", fontSize: "16px" }}>
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box style={{ fontSize: "20px" }}>{rule.name}</Box>
          <Box>
            <IconButton onClick={() => setDeleteOpen(true)}>
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
            <span>{rule.process}</span>
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
