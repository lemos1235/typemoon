import {
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface Props {
  menus: MenuSidebarItem[];
  current: string;
  onSelected: (index: string) => void;
}

interface MenuSidebarItem {
  label: string;
  index: string;
}

export default function MenuSidebar(props: Props) {
  const { menus, current, onSelected } = props;
  return (
    <List
      sx={(theme) => ({
        background: "#fafafa",
        ...theme.applyStyles("dark", {
          background: "#242424",
        }),
      })}
      className="menubar">
      {menus.map((item, index) => (
        <ListItem
          key={index}
          sx={{ py: 0.5, maxWidth: 250, mx: "auto", padding: "4px 0px" }}>
          <ListItemButton
            sx={[
              {
                borderRadius: 2,
                marginLeft: 1.25,
                paddingLeft: 1,
                paddingRight: 1,
                marginRight: 1.25,
              },
              (theme) => {
                const selectedBgcolor = alpha(theme.palette.primary.main, 0.15);
                const selectedColor = theme.palette.text.primary;
                const color = theme.palette.text.primary;

                const darkSelectedBgcolor = alpha(
                  theme.palette.primary.main,
                  0.35,
                );
                const darkColor = alpha(theme.palette.text.primary, 0.7);
                const darkSelectedColor = theme.palette.text.primary;

                return {
                  "&.Mui-selected": { bgcolor: selectedBgcolor },
                  "&.Mui-selected:hover": { bgcolor: selectedBgcolor },
                  "&.Mui-selected .MuiListItemText-primary": {
                    color: selectedColor,
                  },
                  "& .MuiListItemText-primary": {
                    color: color,
                    fontWeight: "500",
                  },
                  ...theme.applyStyles("dark", {
                    "&.Mui-selected": { bgcolor: darkSelectedBgcolor },
                    "&.Mui-selected:hover": { bgcolor: darkSelectedBgcolor },
                    "&.Mui-selected .MuiListItemText-primary": {
                      color: darkSelectedColor,
                    },
                    "& .MuiListItemText-primary": {
                      color: darkColor,
                      fontWeight: "500",
                    },
                  }),
                };
              },
            ]}
            selected={item.index == current}
            onClick={() => onSelected(item.index)}>
            <ListItemText
              sx={{
                textAlign: "center",
              }}
              primary={item.label}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
