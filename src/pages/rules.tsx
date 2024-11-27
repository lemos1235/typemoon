import { BasePage } from "@/components/base";
import { CustomRules } from "@/components/rules/custom-rules";
import { Box } from "@mui/material";

const RulesPage = () => {
  return (
    <BasePage full contentStyle={{ height: "100%" }}>
      <Box sx={{ flex: 1, height: "100%" }}>
        <CustomRules />
      </Box>
    </BasePage>
  );
};

export default RulesPage;
