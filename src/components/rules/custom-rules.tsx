import { useMoon } from "@/hooks/use-moon";
import { RuleEditDialog, RuleEditDialogRef } from "./rule-edit-dialog";
import { useRef } from "react";
import { Box, Stack } from "@mui/material";
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
        <Box
          sx={{
            color: "var(--text-primary)",
            cursor: "pointer",
            marginTop: "-25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => ruleEditDialogRef.current?.create()}
        >
          <Plus size={36} />
          <span style={{ fontSize: "18px", marginLeft: "8px" }}>规则</span>
        </Box>
        <RuleEditDialog ref={ruleEditDialogRef} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Stack direction="row" justifyContent="flex-end" marginBottom={"-8px"}>
        <VpnButton />
        <Box
          sx={{
            color: "var(--text-primary)",
            padding: "8px 8px 0 0",
            cursor: "pointer",
          }}
          onClick={() => ruleEditDialogRef.current?.create()}
        >
          <Plus />
        </Box>
      </Stack>
      <RuleList ruleList={ruleList} />
      <RuleEditDialog ref={ruleEditDialogRef} />
    </Box>
  );
};
