import { useVerge } from "@/hooks/use-verge";
import { alpha, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

interface Props {
  to: string;
  children: string;
  icon: React.ReactNode;
}
export const LayoutItem = (props: Props) => {
  const { to, children, icon } = props;
  const { verge } = useVerge();
  const { menu_icon } = verge ?? {};
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const navigate = useNavigate();

  return (
    <ListItem sx={{ py: 0.5, maxWidth: 250, mx: "auto", padding: "4px 0px" }}>
      <ListItemButton
        selected={!!match}
        sx={[
          {
            justifyContent: "center",
            borderRadius: 2,
            marginLeft: 1.25,
            paddingLeft: 1,
            paddingRight: 1,
            marginRight: 1.25,
            "& .MuiListItemText-primary": {
              color: "text.primary",
              fontWeight: "700",
            },
          },
          (theme) => {
            const bgcolor = alpha(theme.palette.primary.main, 0.15);
            const color = "#1f1f1f";
            const darkBgColor = alpha(theme.palette.primary.main, 0.35);
            const darkColor = "#ffffff";
            return {
              "&.Mui-selected": { bgcolor },
              "&.Mui-selected:hover": { bgcolor },
              "&.Mui-selected .MuiListItemText-primary": { color },
              ...theme.applyStyles("dark", {
                "&.Mui-selected": { darkBgColor },
                "&.Mui-selected:hover": { darkBgColor },
                "&.Mui-selected .MuiListItemText-primary": { darkColor },
              }),
            };
          },
        ]}
        onClick={() => navigate(to)}>
        {(menu_icon === "monochrome" || !menu_icon) && (
          <ListItemIcon
            sx={{
              color: "text.primary",
              justifyContent: "center",
              minWidth: "38px",
            }}>
            {icon}
          </ListItemIcon>
        )}
      </ListItemButton>
    </ListItem>
  );
};
