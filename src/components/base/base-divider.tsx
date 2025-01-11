import { Divider, styled } from "@mui/material";

const BaseDivider = styled(Divider)(({ theme }) => ({
  borderColor: "#f8f8f8",
  ...theme.applyStyles("dark", { borderColor: "#212121" }),
}));

export default BaseDivider;
