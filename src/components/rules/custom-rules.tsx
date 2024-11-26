import { useMoon } from "@/provider/moon";
import { RuleEditDialog, RuleEditDialogRef } from "./rule-edit-dialog";
import { useRef } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import { Plus } from "lucide-react";
import RuleList from "./rule-list";
import VpnButton from "../vpn/vpn-button";

// 自定义规则
export const CustomRules = () => {
  const ruleEditDialogRef = useRef<RuleEditDialogRef>(null);

  const { moon } = useMoon();

  const ruleList = moon?.rule_list || [];

  if (ruleList.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <IconButton
          color="primary"
          disableRipple
          sx={{ marginTop: "-30px" }}
          onClick={() => ruleEditDialogRef.current?.create()}
        >
          <Plus size={36} />
          <span style={{ fontSize: "20px", marginLeft: "8px" }}>规则</span>
        </IconButton>
        <RuleEditDialog ref={ruleEditDialogRef} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Stack direction="row" justifyContent="flex-end" marginBottom={"-8px"}>
        <VpnButton />
        <IconButton
          color="primary"
          onClick={() => ruleEditDialogRef.current?.create()}
        >
          <Plus />
        </IconButton>
      </Stack>
      <RuleList ruleList={ruleList} />
      <RuleEditDialog ref={ruleEditDialogRef} />
    </Box>
  );
};
