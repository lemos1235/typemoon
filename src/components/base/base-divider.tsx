import { Divider, styled } from "@mui/material";

const BaseDivider = styled(Divider)(({ theme }) => ({
  borderColor: "#EEEEEE",
  ...theme.applyStyles("dark", { borderColor: "#1b1b1b" }),
}));

export default BaseDivider;
