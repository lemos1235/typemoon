import { alpha, Box, Typography } from "@mui/material";

interface Props {
  text?: React.ReactNode;
  extra?: React.ReactNode;
}

export const BaseEmpty = (props: Props) => {
  const { text = "数据为空", extra } = props;

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 0px 5px #EEEEEE",
        color: alpha(theme.palette.text.secondary, 0.75),
      })}>
      <Typography sx={{ fontSize: "1em" }}>{`${text}`}</Typography>
      {extra}
    </Box>
  );
};
